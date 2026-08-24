# API Integration & Architecture Documentation

This document provides a comprehensive overview of the authentication setup, data access layer, and administrative server actions for the application.

---

## 1. Authentication Layer (`Better Auth`)

Authentication is handled via **Better Auth**, mounted at the standard Next.js catch-all API route.

- **Route Path:** `src/app/api/auth/[...all]/route.ts`
- **Route Handlers:**

```typescript
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);
```

---

## 2. Session & Security Guard

All admin actions and data access queries are guarded by an administrative session validator:

- **Function:** `getSession("admin")`
- **Behavior:** Verifies that the incoming request belongs to an authenticated user with an `admin` role before executing any database operations.

---

## 3. Admin Data Access Layer (Queries)

These functions fetch data securely from the PostgreSQL database using Drizzle ORM under admin permissions.

| Function Name         | Parameters                                  | Description                                                                                                                  |
| --------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `getAllUsers`         | None                                        | Fetches all registered users ordered by creation date descending.                                                            |
| `getUsersWithFilters` | `params: { search?, role?, page?, limit? }` | Fetches filtered, searched, and paginated users. Returns a list alongside pagination metadata (`total`, `totalPages`, etc.). |
| `getAllBookings`      | None                                        | Retrieves all booking records in the system.                                                                                 |
| `getAllRevenue`       | None                                        | Retrieves all payment and revenue transactions.                                                                              |
| `getAllCategories`    | None                                        | Fetches all service categories ordered alphabetically by name.                                                               |
| `getAllServices`      | None                                        | Fetches all services with a left join to include their corresponding category names.                                         |

---

## 4. Admin Page-Level Actions (Mutations)

These server actions handle data mutations (Create, Update, Delete, Toggle Status) and automatically trigger cache revalidation via Next.js `revalidatePath`.

### **User Management Actions**

- **`toggleUserStatusAction(userId, targetStatus)`**
- _Parameters:_ `userId` (string), `targetStatus` ("active" | "banned")
- _Behavior:_ Updates user status and revalidates `/admin/users`.

- **`deleteUserAction(userId)`**
- _Parameters:_ `userId` (string)
- _Behavior:_ Deletes a user record and revalidates `/admin/users`.

### **Category Management Actions**

- **`createCategoryAction(data)`**
- _Parameters:_ `data: { name: string, description: string, isActive?: boolean }`
- _Validation:_ Uses Zod to ensure name and description are present.
- _Behavior:_ Inserts a new category and revalidates `/admin/category`.

- **`updateCategoryAction(id, data)`**
- _Parameters:_ `id` (string), `data: { name, description, isActive? }`
- _Behavior:_ Updates category details and revalidates `/admin/category`.

- **`toggleCategoryStatusAction(id, isActive)`**
- _Parameters:_ `id` (string), `isActive` (boolean)
- _Behavior:_ Updates active status toggle and revalidates `/admin/category`.

- **`deleteCategoryAction(id)`**
- _Parameters:_ `id` (string)
- _Behavior:_ Deletes category record and revalidates `/admin/category`.

### **Service Management Actions**

- **`createServiceAction(data)`**
- _Parameters:_ `data: { name: string, description: string, categoryId: string, isActive?: boolean }`
- _Validation:_ Uses Zod to validate fields including a valid UUID for `categoryId`.
- _Behavior:_ Creates a new service and revalidates `/admin/category`.

- **`updateServiceAction(id, data)`**
- _Parameters:_ `id` (string), `data` (Service object payload)
- _Behavior:_ Updates service details and revalidates `/admin/category`.

- **`toggleServiceStatusAction(id, isActive)`**
- _Parameters:_ `id` (string), `isActive` (boolean)
- _Behavior:_ Toggles service availability state and revalidates `/admin/category`.

- **`deleteServiceAction(id)`**
- _Parameters:_ `id` (string)
- _Behavior:_ Deletes service record and revalidates `/admin/category`.

## 5. Technician Data Access Layer (`technician`)

Technician queries are secured using `getSession("technician")`. They automatically handle profile provisioning via an upsert pattern (`getOrCreateTechnicianProfile`).

| Function Name                  | Parameters                                    | Description                                                                                                                                        |
| ------------------------------ | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getOrCreateTechnicianProfile` | None                                          | Fetches the technician profile linked to the session user. If it doesn't exist, it auto-initializes a default record with standard profile fields. |
| `getTechnicianDashboardData`   | None                                          | Aggregates technician stats (pending jobs, upcoming jobs, completed jobs, total earnings) and slices recent active items.                          |
| `getTechnicianBookings`        | `params: { search?, status?, page?, limit? }` | Fetches filtered, searched, and paginated bookings specific to the technician.                                                                     |
| `getTechnicianServicesData`    | None                                          | Fetches the technician's custom catalog (`myServices` with custom rates) alongside all active platform services (`allPlatformServices`).           |

---

## 6. Technician Page-Level Actions (Mutations)

These server actions handle profile management, pricing modifications for specialized services, and booking status transitions.

### **Profile Management Actions**

- **`updateTechnicianProfileAction(data)`**
- _Parameters:_ `data: { bio: string, city: string, isAvailable: boolean }`
- _Validation:_ Uses Zod (`profileSchema`) to ensure bio is at least 5 characters and city is provided.
- _Behavior:_ Updates profile data and revalidates `/technician/profile` and `/technician/dashboard`.

### **Service & Pricing Management Actions**

- **`addTechnicianServiceAction(serviceId, price)`**
- _Parameters:_ `serviceId` (string/UUID), `price` (number)
- _Validation:_ Uses Zod (`serviceRateSchema`) and checks for existing entries to prevent duplication.
- _Behavior:_ Inserts a new service pricing record into `technicianServices` and revalidates `/technician/profile`.

- **`updateTechnicianServicePriceAction(id, price)`**
- _Parameters:_ `id` (string - tech service mapping ID), `price` (number)
- _Behavior:_ Updates the price for an assigned service and revalidates `/technician/profile`.

- **`removeTechnicianServiceAction(id)`**
- _Parameters:_ `id` (string - tech service mapping ID)
- _Behavior:_ Deletes a service mapping from the technician’s profile and revalidates `/technician/profile`.

### **Booking Lifecycle Actions**

- **`updateBookingStatusAction(bookingId, newStatus)`**
- _Parameters:_ `bookingId` (string), `newStatus` (`"pending" | "confirmed" | "completed" | "cancelled" | "in_progress" | "declined" | "paid"`)
- _Behavior:_ Validates ownership of the booking (`technicianId` match), updates the status with a timestamp, and revalidates both `/technician/dashboard` and `/technician/booking`.

## 7. Customer Data Access Layer (`customer`)

Customer queries are validated using `getSession("customer")`. They provide secure access to user dashboards, booking lists, payment logs, and public catalog data.

| Function Name                     | Parameters                         | Description                                                                                                                     |
| --------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `getCustomerDashboardData`        | None                               | Retrieves customer profile information, joined bookings, payment records, reviews, and a computed list of reviewed booking IDs. |
| `getPublicServicesWithCategories` | `params: { search?, categoryId? }` | Fetches active platform categories, filtered active services, and available technician offerings (`techOfferings`).             |
| `getTechnicianPublicDetails`      | `technicianId` (string)            | Fetches public technician details, assigned catalog services with customized rates, and customer reviews.                       |
| `getBookingForPayment`            | `bookingId` (string)               | Validates ownership and fetches specific pending/confirmed booking details needed for payment processing.                       |
| `getCustomerBookingHistory`       | None                               | Retrieves all booking records made by the customer, ordered from newest to oldest.                                              |
| `getCustomerPaymentHistory`       | None                               | Retrieves all payment transactions made by the customer via inner-joined booking records, ordered by latest.                    |
| `getAvailableTechnicians`         | None                               | Fetches all technician service mapping rows.                                                                                    |
| `getAvalilableServices`           | None                               | Fetches all platform service records.                                                                                           |

---

## 8. Customer Page-Level Actions (Mutations & Workflows)

These server actions handle booking creation, anti-conflict scheduling validation, Stripe checkout sessions, payment confirmation callbacks, and reviews.

### **Booking & Scheduling Workflow**

- **`createBookingAction(data)`**
- _Parameters:_ `data: { technicianId: string, serviceId: string, scheduledAt: string }`
- _Validation:_ Uses Zod (`bookingSchema`), checks date validity, confirms technician service offering & online status, and runs a **±45 minute buffer overlap query** to prevent double-booking.
- _Behavior:_ Inserts a booking request with `pending` status and revalidates paths for `/customer/dashboard`, `/technician/dashboard`, and `/technician/booking`.

- **`cancelBookingAction(bookingId)`**
- _Parameters:_ `bookingId` (string)
- _Behavior:_ Validates booking ownership and state (prevents cancellation of `in_progress` or `completed` jobs), updates status to `cancelled`, and revalidates dashboard/booking paths.

### **Stripe Payment Gateway Integration**

- **`createStripeCheckoutAction(bookingId)`**
- _Parameters:_ `bookingId` (string)
- _Validation:_ Confirms the booking status is `"confirmed"` before allowing checkout initialization.
- _Behavior:_ Creates a Stripe Checkout Session using dynamic request headers for base URLs and returns the checkout session `url`.

- **`confirmStripePaymentAction(sessionId, bookingId)`**
- _Parameters:_ `sessionId` (string), `bookingId` (string)
- _Behavior:_ Queries Stripe to verify payment status is `"paid"`, creates a payment record in the database if missing, transitions the booking status to `"paid"`, and triggers cache revalidation.

### **Reviews & Ratings Workflow**

- **`submitReviewAction(data)`**
- _Parameters:_ `data: { bookingId: string, technicianId: string, rating: number, comment?: string }`
- _Validation:_ Uses Zod (`reviewSchema`), verifies booking completion state, and guards against duplicate reviews.
- _Behavior:_ Inserts the review, dynamically recalculates the technician's average rating (`ratingAvg`), updates the technician profile record, and revalidates related paths.
