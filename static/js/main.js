// ===== GLOBAL VARIABLES =====
let products = [];
let selectedColors = [];
let currentTestimonial = 0;
const totalTestimonials = 3;

// ===== DOM ELEMENTS =====
const header = document.getElementById('header');
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const dashboard = document.getElementById('dashboard');
const logoutBtn = document.getElementById('logoutBtn');
const refreshProductsBtn = document.getElementById('refreshProducts');
const productsGrid = document.getElementById('productsGrid');
const dashboardProducts = document.getElementById('dashboardProducts');
const addProductForm = document.getElementById('addProductForm');
const editProductForm = document.getElementById('editProductForm');
const saleProductForm = document.getElementById('saleProductForm');
const restockProductForm = document.getElementById('restockProductForm');
const editFishermanForm = document.getElementById('editFishermanForm');
const FishermanForm = document.getElementById('FishermanForm');
const addFishermanForm = document.getElementById('addFishermanForm');
const colorOptions = document.querySelectorAll('#colorOptions .color-option');
const selectedColorsInput = document.getElementById('selectedColors');
const filterBtns = document.querySelectorAll('.filter-btn');
const testimonialTrack = document.getElementById('testimonialTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const faqItems = document.querySelectorAll('.faq-item');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {


    const accessToken = localStorage.getItem('access');
    const group = localStorage.getItem('group');
    const currentPath = window.location.pathname;

    if (group === "Staff") {
        $('.managements').hide();
    }
    if (accessToken === null || accessToken.trim() === '') {
        if (currentPath !== '/fisher_man/log_in') {
          window.location.href = '/fisher_man/log_in';
        }
    } else {
        if (currentPath === '/fisher_man/log_in') {
          window.location.href = '/';
        }
    }

    initProducts();
    if(window.location.pathname === '/fish/dashboard') {
        initDashboardStats();
    } else if(window.location.pathname === '/log/buy/') {
        initBuyRecords();
    } else if(window.location.pathname === '/log/sell/') {
        initSellRecords();
    } else if(window.location.pathname === '/log/activity/') {
        initActivityRecords();
    }
    initEventListeners();
    updateHeaderOnScroll();
    animateFloatingElements();
});

// ===== PRODUCTS MANAGEMENT =====
function initProducts() {
    $.ajax({
      headers: { Authorization: 'Bearer ' +localStorage.getItem('access') },
      type: "GET",
      url: "/fish/products_api",
      success: function (products) {
        for (var x = 0; x < products.length; x++) {
          const product = products[x];
          const categoryLabel = product.category === 0 ? "River fish" : "Sea fish";

          $('.section-title').append(`
            <div class="product-card" data-category="${product.name}">
              <div class="product-content">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description || ""}</p>
                <div class="product-footer">
                  <div class="product-price">Price: ${product.selling_price}</div>
                  <div class="product-quantity">Quantity: ${product.quantity}</div>
                  <div class="product-source">Source: ${product.source}</div>
                  <div class="product-category">${categoryLabel}</div>
                  <div class="product-actions">
                  ${localStorage.getItem("group") !== "Staff" ? `
                    <button class="action-btn edit" onclick="window.location.href='/fish/edit_product/${product.name}'">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn edit" onclick="window.location.href='/fish/restock_product/${product.name}'">
                      <i class="fa-solid fa-plus"></i>
                    </button>
                  ` : ""}
                  <button class="action-btn edit" onclick="window.location.href='/fish/sale/${product.name}'">
                    <i class="fa-solid fa-shop"></i>
                  </button>
                  </div>
                </div>
              </div>
            </div>
          `);
        }
      },
      error: function (errormsg) {
        console.log(errormsg);
      }
    });
}


function initBuyRecords() {
    $.ajax({
      headers: { Authorization: 'Bearer ' +localStorage.getItem('access') },
      type: "GET",
      url: "/log/buy_list_api",
      success: function (records) {
        // Create table structure
        $('.section-record').append(`
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Product</th>
                            <th>Supplier</th>
                            <th>Qty</th>
                            <th>Buying Price</th>
                            <th>Total</th>
                            <th>Date</th>
                            <th>Manager</th>
                        </tr>
                    </thead>
                    <tbody id="buyRecordsBody">
                    </tbody>
                </table>
            </div>
        `);

        records.forEach(record => {
            const date = record.created_at;
            $('#buyRecordsBody').append(`
                <tr>
                    <td>#${record.invoice_no}</td>
                    <td>${record.product}</td>
                    <td>
                        <div class="supplier-info">
                            <strong>${record.supplier_name}</strong><br>
                            <small>${record.supplier_phone || ''}</small>
                        </div>
                    </td>
                    <td>${record.quantity}</td>
                    <td>${record.buying_price}</td>
                    <td>${record.total_amount}</td>
                    <td>${date}</td>
                    <td>${record.buying_manager}</td>
                </tr>
            `);
        });
      },
      error: function (errormsg) {
        console.log(errormsg);
      }
    });
}


function initSellRecords() {
    $.ajax({
      headers: { Authorization: 'Bearer ' +localStorage.getItem('access') },
      type: "GET",
      url: "/log/sell_list_api",
      success: function (records) {
        // Create table structure
        $('.section-record').append(`
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Product</th>
                            <th>Customer</th>
                            <th>Qty</th>
                            <th>Unit Price</th>
                            <th>Total</th>
                            <th>Date</th>
                            <th>Seller</th>
                        </tr>
                    </thead>
                    <tbody id="sellRecordsBody">
                    </tbody>
                </table>
            </div>
        `);

        records.forEach(record => {
            const date = record.created_at;
            $('#sellRecordsBody').append(`
                <tr>
                    <td>#${record.invoice_no}</td>
                    <td>${record.product}</td>
                    <td>
                        <div class="supplier-info">
                            <strong>${record.customer_name}</strong><br>
                            <small>${record.customer_phone || ''}</small>
                        </div>
                    </td>
                    <td>${record.quantity}</td>
                    <td>${record.unit_price}</td>
                    <td>${record.total_amount}</td>
                    <td>${date}</td>
                    <td>${record.seller}</td>
                </tr>
            `);
        });
      },
      error: function (errormsg) {
        console.log(errormsg);
      }
    });
}

function initActivityRecords() {
    $.ajax({
      headers: { Authorization: 'Bearer ' +localStorage.getItem('access') },
      type: "GET",
      url: "/log/activity_list_api",
      success: function (records) {
        // Create table structure
        $('.section-record').append(`
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Action</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody id="activityRecordsBody">
                    </tbody>
                </table>
            </div>
        `);

        records.forEach(record => {
            const date = record.time;
            const action = record.is_login ? '<span style="color: green;">Login</span>' : '<span style="color: red;">Logout</span>';
            $('#activityRecordsBody').append(`
                <tr>
                    <td>${record.user_name}</td>
                    <td>${action}</td>
                    <td>${date}</td>
                </tr>
            `);
        });
      },
      error: function (errormsg) {
        console.log(errormsg);
      }
    });
}


function initDashboardStats() {
    $.ajax({
      headers: { Authorization: 'Bearer ' +localStorage.getItem('access') },
      type: "GET",
      url: "/fish/dashboard_stats_api",
      success: function (data) {
        $("#totalSell").text(data.total_sell);
        $("#totalBuy").text(data.total_buy);
        $("#totalStock").text(data.total_stock);
      },
      error: function (errormsg) {
        console.log(errormsg);
      }
    });
}

function editProduct(){
    var path = window.location.pathname.split('/');
    var url = "/fish/edit_product_api/"+path[3];
    console.log(url)
    $.ajax({
    headers: { Authorization: 'Bearer ' +localStorage.getItem('access')},
    type: "GET",
    url: url,
    success: function (product) {
        $("#editProductName").val(product.name);
        $("#editBuyingPrice").val(product.buying_price);
        $("#editProductPrice").val(product.selling_price);
        $("#editProductQuantity").val(product.quantity);
        $("#editProductSource").val(product.source);
        $("#editProductDescription").val(product.description);
        $("#editProductCategory").val(product.category);
        $("#editProductCreatedBy").val(product.created_by);
        $("#editProductCreatedAt").val(product.created_at);
        $("#editProductModifyBy").val(product.modified_by);
        $("#editProductModifyAt").val(product.modified_at);
    },
    error: function (errormsg) {
        console.log(errormsg);
    }
    });
}

function saleProduct(){
        var path = window.location.pathname.split('/');
        var url = "/fish/edit_product_api/"+path[3];
        console.log(url)
        $.ajax({
        headers: { Authorization: 'Bearer ' +localStorage.getItem('access')},
        type: "GET",
        url: url,
        success: function (product) {
            $("#saleProductName").val(product.name);
            $("#saleProductPrice").val(product.selling_price);
            $("#saleProductQuantity").val(product.quantity);
            $("#saleProductSource").val(product.source);
            $("#saleProductDescription").val(product.description);
            $("#saleProductCategory").val(product.category);
        },
        error: function (errormsg) {
            console.log(errormsg);
        }
        });
}

function restockProduct(){
        var path = window.location.pathname.split('/');
        var url = "/fish/edit_product_api/"+path[3];
        console.log(url)
        $.ajax({
        headers: { Authorization: 'Bearer ' +localStorage.getItem('access')},
        type: "GET",
        url: url,
        success: function (product) {
            $("#restockProductName").val(product.name);
            $("#restockBuyingPrice").val(product.buying_price);
            $("#restockSellingPrice").val(product.selling_price);
            $("#restockProductQuantity").val(product.quantity);
            $("#restockProductSource").val(product.source);
            $("#restockProductDescription").val(product.description);
            $("#restockProductCategory").val(product.category);
            $("#restockProductCreatedBy").val(product.created_by);
            $("#restockProductCreatedAt").val(product.created_at);
            $("#restockProductModifyBy").val(product.modified_by);
            $("#restockProductModifyAt").val(product.modified_at);
        },
        error: function (errormsg) {
            console.log(errormsg);
        }
        });
}

// ===== USER MANAGEMENT =====
function fishermanList(){
    $.ajax({
      headers: { Authorization: 'Bearer ' +localStorage.getItem('access') },
      type: "GET",
      url: "/fisher_man/fisherman_list_api",
success: function (fishermen) {
  $('.section-user').html("");
  for (var x = 0; x < fishermen.length; x++) {
    const fisherman = fishermen[x];
    let designation = "";

    if (fisherman.designation === 0) {
      designation = "Owner";
    } else if (fisherman.designation === 1) {
      designation = "Manager";
    } else if (fisherman.designation === 2) {
      designation = "Staff";
    }

    $('.section-user').append(`
      <div class="product-card">
        <div class="product-content">
          <h3 class="product-title">${fisherman.email}</h3>
          <p class="product-description">${designation}</p>
          <div class="product-footer">
            <div class="product-price">Active: ${fisherman.active}</div>
            <div class="product-quantity">Name: ${fisherman.name}</div>
            <div class="product-source">Phone: ${fisherman.phone}</div>
            <div class="product-actions">
            ${fisherman.active === true ? `
                    <button class="action-btn edit" onclick="deactiveFisherman('${fisherman.email}')">
                      <i class="fa-solid fa-ban"></i>
                    </button>
                  ` : `
                  <button class="action-btn edit" onclick="activeFisherman('${fisherman.email}')">
                      <i class="fa-solid fa-circle-check"></i>
                  </button>`}
              <button class="action-btn edit" onclick="window.location.href='/fisher_man/edit_user/${fisherman.email}'">
                <i class="fas fa-edit"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `);
  }
},
      error: function (errormsg) {
        console.log(errormsg);
      }
    });
}

function activeFisherman(email) {
  const data = {
    email: email,
    active: 1
  };

  $.ajax({
    type: "PUT",
    url: "/fisher_man/update_fisherman_api",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("access")
    },
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (response) {
      console.log(response);
      fishermanList();
    },
    error: function (response) {
      $('#product_status').html("");
      if (response.responseJSON && response.responseJSON.message) {
        $('#product_status').append(response.responseJSON.message);
      } else {
        $('#product_status').append("An error occurred");
      }
    }
  });
}

function deactiveFisherman(email) {
  const data = {
    email: email,
    active: 0
  };

  $.ajax({
    type: "PUT",
    url: "/fisher_man/update_fisherman_api",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("access")
    },
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (response) {
      console.log(response);
      fishermanList();
    },
    error: function (response) {
      $('#product_status').html("");
      if (response.responseJSON && response.responseJSON.message) {
        $('#product_status').append(response.responseJSON.message);
      } else {
        $('#product_status').append("An error occurred");
      }
    }
  });
}

function editFisherman(){
        var path = window.location.pathname.split('/');
        var url = "/fisher_man/fisherman_edit_api/"+path[3];
        console.log(url)
        $.ajax({
        headers: { Authorization: 'Bearer ' +localStorage.getItem('access')},
        type: "GET",
        url: url,
        success: function (fisherman) {
            console.log(fisherman)
            $("#editFishermanName").val(fisherman.name);
            $("#editFishermanEmail").val(fisherman.email);
            $("#editFishermanPhone").val(fisherman.phone);
            $("#editFishermanDesignation").val(fisherman.designation);
            $("#editFishermanCreatedBy").val(fisherman.created_by);
            $("#editFishermanCreatedAt").val(fisherman.created_at);
            $("#editFishermanModifyBy").val(fisherman.modified_by);
            $("#editFishermanModifyAt").val(fisherman.modified_at);
        },
        error: function (errormsg) {
            console.log(errormsg);
        }
        });
}

function fisherman(email){
        var url = "/fisher_man/fisherman_edit_api/"+email;
        console.log(url)
        $.ajax({
        headers: { Authorization: 'Bearer ' +localStorage.getItem('access')},
        type: "GET",
        url: url,
        success: function (fisherman) {
            $("#FishermanName").val(fisherman.name);
            $("#FishermanEmail").val(fisherman.email);
            $("#FishermanPhone").val(fisherman.phone);
            $("#FishermanDesignation").val(fisherman.designation);
        },
        error: function (errormsg) {
            console.log(errormsg);
        }
        });
}

// ===== EVENT LISTENERS =====
function initEventListeners() {
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', e => {
            e.preventDefault();
            var email = $("#email").val();
            var password = $("#password").val();
            $.ajax({
                type: "POST",
                url: "/fisher_man/log_in_api",
                data: JSON.stringify({'email': email, 'password': password}),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(response){
                    if(response.status == 200){
                        localStorage.setItem("full_name", response.full_name);
                        localStorage.setItem("access", response.access);
                        localStorage.setItem("email", response.email);
                        localStorage.setItem("group", response.group);
                        window.location.href = '/';
                    }else{
                        $('.login-error').html("");
                        $('.login-error').append(`${response.responseJSON.message}`);
                    }
                },
                error: function(response){
                    $('.login-error').html("");
                    $('.login-error').append(`${response.responseJSON.message}`);
                }
            });
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          $.ajax({
              type: "POST",
              url: "/fisher_man/logout_api",
              headers: {
              Authorization: "Bearer " + localStorage.getItem("access")
              },
              data: JSON.stringify({}),
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              success: function(response){
                  if(response.status == 200){
                      localStorage.removeItem("full_name");
                      localStorage.removeItem("access");
                      localStorage.removeItem("email");
                      localStorage.removeItem("group");
                      window.location.href = '/fisher_man/log_in';
                  }
              },
              error: function(response){
                console.log(response);  
              }
          });
        });
    }

    if(editProductForm){
        editProductForm.addEventListener('submit', e => {
            e.preventDefault();

            const productData = {
            name: $("#editProductName").val(),
            selling_price: $("#editProductPrice").val()
            };

            $.ajax({
            type: "PUT",
            url: "/fish/update_price_api",
            headers: {
            Authorization: "Bearer " + localStorage.getItem("access")
            },
            data: JSON.stringify(productData),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $('#product_status').html("");
                $('#product_status').append(`${response.message}`);
            },
            error: function (response) {
                $('#product_status').html("");
                $('#product_status').append(`${response.responseJSON.message}`);
            }
            });
        });
    }

    if(saleProductForm){
        saleProductForm.addEventListener('submit', e => {
            e.preventDefault();
          
            const sellData = {
                customer_name: $("#saleCustomerName").val(),
                customer_phone: $("#saleCustomerPhone").val(),
                customer_address: $("#saleCustomerAddress").val(),
                quantity: $("#saleQuantity").val(),
                unit_price: $("#saleProductPrice").val(),
                total_amount: $("#saleTotalPrice").val(),
                product: $("#saleProductName").val(),
            };

            const productData = {
            name: $("#saleProductName").val(),
            quantity: parseFloat($("#saleQuantity").val()) * -1
            };

            $.ajax({
            type: "PUT",
            url: "/fish/update_quantity_api",
            headers: {
            Authorization: "Bearer " + localStorage.getItem("access")
            },
            data: JSON.stringify(productData),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $('#product_status').html("");
                $('#product_status').append(`${response.message}`);
            },
            error: function (response) {
                $('#product_status').html("");
                $('#product_status').append(`${response.responseJSON.message}`);
            }
            });

            $.ajax({
            type: "POST",
            url: "/log/sell_api",
            headers: {
            Authorization: "Bearer " + localStorage.getItem("access")
            },
            data: JSON.stringify(sellData),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $('#product_status').html("");
                $('#product_status').append(`${response.message}`);
            },
            error: function (response) {
                $('#product_status').html("");
                $('#product_status').append(`${response.responseJSON.message}`);
            }
            });
        });
    }

    if(restockProductForm){
        restockProductForm.addEventListener('submit', e => {
            e.preventDefault();

            const buyData = {
              product: $("#restockProductName").val(),
              buying_price: $("#restockBuyingPrice").val(),
              quantity: $("#restockQuantity").val(),
              source: $("#restockProductSource").val(),
              description: $("#restockProductDescription").val(),
              category: $("#restockProductCategory").val(),  
              supplier_name: $("#restockSupplierName").val(),
              supplier_address: $("#restockSupplierAddress").val(),
              supplier_phone: $("#restockSupplierPhone").val(),
              total_amount: $("#restockTotalAmount").val()
            };

            const productData = {
            name: $("#restockProductName").val(),
            quantity: parseFloat($("#restockQuantity").val())
            };

            $.ajax({
            type: "PUT",
            url: "/fish/update_quantity_api",
            headers: {
            Authorization: "Bearer " + localStorage.getItem("access")
            },
            data: JSON.stringify(productData),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
              if (response.message == "Success") {
                $.ajax({
                type: "POST",
                url: "/log/buy_api",
                headers: {
                Authorization: "Bearer " + localStorage.getItem("access")
                },
                data: JSON.stringify(buyData),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    $('#product_status').html("");
                    $('#product_status').append(`${response.message}`);
                },
                error: function (response) {
                    $('#product_status').html("");
                    $('#product_status').append(`${response.responseJSON.message}`);
                }
                });
              }
              else{
                $('#product_status').html("");
                $('#product_status').append(`${response.message}`);
              }
            },
            error: function (response) {
                $('#product_status').html("");
                $('#product_status').append(`${response.responseJSON.message}`);
            }
            });
        });
    }

    if(addProductForm){
        addProductForm.addEventListener('submit', e => {
            e.preventDefault();

            const buyData = {
              product: $("#productName").val(),
              buying_price: $("#productPrice").val(),
              quantity: $("#productQuantity").val(),
              source: $("#productSource").val(),
              description: $("#productDescription").val(),
              category: $("#productCategory").val(),  
              supplier_name: $("#productSupplierName").val(),
              supplier_address: $("#productSupplierAddress").val(),
              supplier_phone: $("#productSupplierPhone").val(),
              total_amount: $("#productTotalAmount").val()
            }

            const productData = {
              name: $("#productName").val(),
              buying_price: $("#productPrice").val(),
              quantity: $("#productQuantity").val(),
              source: $("#productSource").val(),
              description: $("#productDescription").val(),
              category: $("#productCategory").val(),
            };

            $.ajax({
            type: "POST",
            url: "/fish/add_product_api",
            headers: {
            Authorization: "Bearer " + localStorage.getItem("access")
            },
            data: JSON.stringify(productData),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
              if (response.message == "Success") {
                $.ajax({
                type: "POST",
                url: "/log/buy_api",
                headers: {
                Authorization: "Bearer " + localStorage.getItem("access")
                },
                data: JSON.stringify(buyData),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    $('#product_status').html("");
                    $('#product_status').append(`${response.message}`);
                },
                error: function (response) {
                    $('#product_status').html("");
                    $('#product_status').append(`${response.responseJSON.message}`);
                }
                });
              }else{
                $('#product_status').html("");
                $('#product_status').append(`${response.message}`);
              }
            },
            error: function (response) {
                $('#product_status').html("");
                $('#product_status').append(`${response.responseJSON.message}`);
            }
            });

        });
    }

    if(editFishermanForm){
        editFishermanForm.addEventListener('submit', e => {
            e.preventDefault();

            const productData = {
            email: $("#editFishermanEmail").val(),
            name: $("#editFishermanName").val(),
            phone: $("#editFishermanPhone").val(),
            };

            $.ajax({
            type: "PUT",
            url: "/fisher_man/update_fisherman_api",
            headers: {
            Authorization: "Bearer " + localStorage.getItem("access")
            },
            data: JSON.stringify(productData),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $('#fisherman_status').html("");
                $('#fisherman_status').append(`${response.message}`);
            },
            error: function (response) {
                $('#fisherman_status').html("");
                $('#fisherman_status').append(`${response.responseJSON.message}`);
            }
            });
        });
    }

    if(FishermanForm){
        FishermanForm.addEventListener('submit', e => {
            e.preventDefault();

            const data = {
                password: $("#FishermanPassword").val()
            };
            console.log(data);
            $.ajax({
            type: "PUT",
            url: "/fisher_man/change_password_api",
            headers: {
            Authorization: "Bearer " + localStorage.getItem("access")
            },
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $('#fisherman_status').html("");
                $('#fisherman_status').append(`${response.message}`);
            },
            error: function (response) {
                $('#fisherman_status').html("");
                $('#fisherman_status').append(`${response.message}`);
            }
            });
        });
    }

    if(addFishermanForm){
        addFishermanForm.addEventListener('submit', e => {
            e.preventDefault();

            const data = {
                email: $("#addFishermanEmail").val(),
                name: $("#addFishermanName").val(),
                phone: $("#addFishermanPhone").val(),
                designation: parseInt($("#addFishermanDesignation").val(), 10),
                password: $("#addFishermanPassword").val(),
            };
            console.log(data);
            $.ajax({
            type: "POST",
            url: "/fisher_man/add_fisherman_api",
            headers: {
            Authorization: "Bearer " + localStorage.getItem("access")
            },
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $('#fisherman_status').html("");
                $('#fisherman_status').append(`${response.message}`);
            },
            error: function (response) {
                $('#fisherman_status').html("");
                $('#fisherman_status').append(`${response.message}`);
            }
            });
        });
    }

    $("#saleQuantity").on("input", function() {
        const quantity = parseFloat($(this).val()) || 0;
        const price = parseFloat($("#saleProductPrice").val()) || 0;
        $("#saleTotalPrice").val((quantity * price).toFixed(2));
    });

    $("#productQuantity").on("input", function() {
        const quantity = parseFloat($(this).val()) || 0;
        const price = parseFloat($("#productPrice").val()) || 0;
        $("#productTotalAmount").val((quantity * price).toFixed(2));
    });

    $("#restockQuantity").on("input", function() {
        const quantity = parseFloat($(this).val()) || 0;
        const price = parseFloat($("#restockBuyingPrice").val()) || 0;
        $("#restockTotalAmount").val((quantity * price).toFixed(2));
    });
}

// ===== HEADER =====
function updateHeaderOnScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 100);
}

// ===== ANIMATIONS =====
function animateFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((el, i) => {
        el.style.animationDelay = `${i * 0.5}s`;
    });
}