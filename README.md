# Fish Storage Management System - Project Documentation

## 1. Project Overview
The **Fish Storage Management System** is a full-stack Django application designed to streamline the operations of a fish storage business. It handles inventory management, sales tracking, purchasing, activity logging, and staff administration through a role-based access system.

**Key Technologies:**
*   **Backend:** Django 5.2, Django Rest Framework (DRF)
*   **Database:** SQLite (Default)
*   **Authentication:** JWT (JSON Web Tokens) via `simple_jwt`
*   **Frontend:** Django Templates + jQuery (AJAX interactions)

## Live Link & Credentials
*   **Live Link:** [https://elitefish.pythonanywhere.com/](https://elitefish.pythonanywhere.com/)
*   **Login Email:** `fisherman01@elite.com`
*   **Login Password:** `123456`

## 2. Setup & Installation

Follow these steps to set up the project locally.

### Prerequisites
*   Python 3.10+
*   `pip` (Python Package Manager)

### Installation Steps
1.  **Clone the Repository**
    ```bash
    git clone https://github.com/zsaaupo/eliteFish
    cd eliteFish
    ```

2.  **Create Virtual Environment**
    ```bash
    python -m venv venv
    # Windows
    venv\Scripts\activate
    # Linux/Mac
    source venv/bin/activate
    ```

3.  **Install Dependencies**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run Development Server**
    ```bash
    python manage.py runserver
    ```
    Access the application at `http://127.0.0.1:8000/`.

## 3. Project Directory Structure

```text
c:\eliteFish
├── eliteFish/                  # Project Settings
│   ├── settings.py             # Main configuration (Installed Apps, Database, Auth)
│   ├── urls.py                 # Main URL routing (includes `product`, `user` and `record` urls)
│   └── wsgi.py                 # Gateway for deployment
├── product/                    # App: Inventory & Sales
│   ├── migrations/             # DB schema changes
│   ├── templates/              # HTML files (add_product.html, etc.)
│   ├── models.py               # Product model definition
│   ├── urls.py                 # API endpoints: /fish/...
│   ├── views.py                # Business logic for products
│   └── seriallizer.py          # API data formatting (Note: filename contains typo)
├── user/                       # App: Authentication & Staff
│   ├── templates/              # HTML files (login.html, fisherman.html, etc.)
│   ├── models.py               # FisherMan model definition
│   ├── urls.py                 # API endpoints: /fisher_man/...
│   ├── views.py                # Auth logic & User management
│   └── seriallizer.py          # API data formatting (Note: filename contains typo)
├── record/                     # App: Logs & Activity Tracking
│   ├── models.py               # Sell, Buy, Activity models
│   ├── urls.py                 # API endpoints: /log/...
│   ├── views.py                # Logic for logging transactions and activities
│   └── serializers.py          # API data formatting
├── static/                     # Static Assets (CSS, JS)
├── templates/                  # Global templates
├── manage.py                   # CLI Utility
└── requirements.txt            # Dependency list
```

## 4. Database Schema & Models

### Core Model: `FisherMan` (User Extension)
Extends the built-in Django `User` model to add business-specific fields.

| Field | Type | Description |
| :--- | :--- | :--- |
| `user` | OneToOneField | Links to Django `auth_user` |
| `name` | CharField | Full Name of the staff member |
| `email` | EmailField | Primary Key. Acts as the username. |
| `phone` | CharField | Contact number |
| `designation` | IntegerField | Role ID (0: Business Owner, 1: Storage manager, 2: Sales man) |

### Core Model: `Product`
Stores inventory data.

| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | CharField | Primary Key. Name of the fish. |
| `selling_price` | DecimalField | Price per unit for selling. |
| `buying_price` | DecimalField | Price per unit for buying. |
| `quantity` | PositiveInteger | Current stock level. |
| `category` | IntegerField | 0: River Fish, 1: Sea Fish |
| `source` | CharField | Origin of the fish. |
| `description`| TextField | Optional details. |

### Record Models: `Sell`, `Buy`, `Activity`
Tracks business transactions and user actions.

**Sell:**
| Field | Type | Description |
| :--- | :--- | :--- |
| `invoice_no` | AutoField | Primary Key. |
| `customer_name` | CharField | Name of the buyer. |
| `seller` | CharField | Staff who made the sale. |
| `product` | CharField | Name of the product sold. |
| `quantity` | IntegerField | Amount sold. |
| `total_amount` | DecimalField | Total transaction value. |

**Buy:**
| Field | Type | Description |
| :--- | :--- | :--- |
| `invoice_no` | AutoField | Primary Key. |
| `supplier_name` | CharField | Name of the supplier. |
| `buying_manager` | CharField | Staff who authorized the purchase. |
| `product` | CharField | Name of the product bought. |
| `quantity` | IntegerField | Amount purchased. |
| `total_amount` | DecimalField | Total transaction value. |

**Activity:**
| Field | Type | Description |
| :--- | :--- | :--- |
| `user_name` | CharField | User performing the action. |
| `time` | DateTimeField | Timestamp of action. |
| `is_login` | BooleanField | True if login event. |

## 5. API Reference

### User Management (`/fisher_man/`)
**Base URL:** `http://127.0.0.1:8000/fisher_man/`

| Endpoint | Method | Permission | Description | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| `log_in_api` | POST | Public | Authenticates user & returns JWT | `{"email": "...", "password": "..."}` |
| `logout_api` | POST | Authenticated | Logs out the user (blacklist token) | N/A |
| `add_fisherman_api` | POST | Manager/Owner | Creates a new staff account | `{"name": "...", "email": "...", "phone": "...", "designation": 0/1/2, "password": "..."}` |
| `update_fisherman_api` | PUT | Manager/Owner | Updates user details or active status | `{"email": "...", "active": 0/1, "name": "...", "phone": "..."}` |
| `change_password_api` | PUT | Authenticated | Changes current user's password | `{"password": "new_password"}` |
| `fisherman_list_api` | GET | Manager/Owner | Lists all staff members | N/A |
| `fisherman_edit_api/<email>` | GET | Authenticated | Gets details of a specific user | N/A |

### Product Management (`/fish/`)
**Base URL:** `http://127.0.0.1:8000/fish/`

| Endpoint | Method | Permission | Description | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| `products_api` | GET | Authenticated | Lists all products | N/A |
| `add_product_api` | POST | Manager/Owner | Create new inventory item | `{"name": "...", "price": "...", "quantity": "...", "category": "...", "source": "..."}` |
| `update_quantity_api` | PUT | Authenticated | Restock inventory (Add to qty) | `{"name": "...", "quantity": 10}` |
| `update_price_api` | PUT | Manager/Owner | Update product price | `{"name": "...", "price": 150.00}` |
| `edit_product_api/<name>` | GET | Authenticated | Get details of specific product | N/A |
| `dashboard_stats_api` | GET | Authenticated | Aggregated stats for dashboard | N/A |

### Record Management (`/log/`)
**Base URL:** `http://127.0.0.1:8000/log/`

| Endpoint | Method | Permission | Description | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| `buy_list_api` | GET | Manager/Owner | List purchase history | N/A |
| `sell_list_api` | GET | Manager/Owner | List sales history | N/A |
| `activity_list_api` | GET | Manager/Owner | List user activity logs | N/A |
| `sell_api` | POST | Authenticated | Record a new sale | `{"customer_name": "...", "product": "...", "quantity": "...", "unit_price": "...", "total_amount": "..."}` |
| `buy_api` | POST | Manager/Owner | Record a new purchase | `{"supplier_name": "...", "supplier_phone": "...", "product": "...", "quantity": "...", "buying_price": "...", "total_amount": "..."}` |

## 6. User Roles & Permissions

The system uses a group-based permission model enforced by the `IsManagement` permission class.

| Role | Designation ID | Create Users | Create Products | Update Price | Restock | View Dashboard |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Owner** | 0 | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Manager** | 1 | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Sales Man**| 2 | ❌ | ❌ | ❌ | ❌ | ✅ |

*   **Restocking**: All authenticated users (including Sales Men) can update product quantities (restock).
*   **Management**: Only Owners and Managers can create new products, change prices, or manage staff accounts.

## 7. Frontend Architecture
The frontend is built using **Django Templates** served directly by views, but they act as "Single Page Application" shells. 
*   **Routing**: Django URL patterns serve the HTML files.
*   **Data Fetching**: The HTML pages use `jQuery` to make `AJAX` calls to the `_api` endpoints listed above.
*   **Dynamic UI**: The DOM is updated based on the JSON response from the API.
