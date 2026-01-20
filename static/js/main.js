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
const dashboardProductForm = document.getElementById('dashboardProductForm');
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
    initEventListeners();
    initTestimonialSlider();
    updateHeaderOnScroll();
    setActiveNavLink();
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
                  <div class="product-price">Price: ${product.price}</div>
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
        $("#editProductPrice").val(product.price);
        $("#editProductQuantity").val(product.quantity);
        $("#editProductSource").val(product.source);
        $("#editProductDescription").val(product.description);
        $("#editProductCategory").val(product.category);
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
            $("#saleProductPrice").val(product.price);
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
            $("#restockProductPrice").val(product.price);
            $("#restockProductQuantity").val(product.quantity);
            $("#restockProductSource").val(product.source);
            $("#restockProductDescription").val(product.description);
            $("#restockProductCategory").val(product.category);
        },
        error: function (errormsg) {
            console.log(errormsg);
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
            $("#editFishermanName").val(fisherman.name);
            $("#editFishermanEmail").val(fisherman.email);
            $("#editFishermanPhone").val(fisherman.phone);
            $("#editFishermanDesignation").val(fisherman.designation);
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
            localStorage.removeItem("full_name");
            localStorage.removeItem("access");
            localStorage.removeItem("email");
            localStorage.removeItem("group");
            window.location.href = '/fisher_man/log_in';
        });
    }

    if(editProductForm){
        editProductForm.addEventListener('submit', e => {
            e.preventDefault();

            const productData = {
            name: $("#editProductName").val(),
            price: $("#editProductPrice").val()
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
                $('#product_status').append(`${response.massage}`);
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

            const productData = {
            name: $("#saleProductName").val(),
            quantity: parseFloat($("#saleQuantity").val()) * -1
            };

            console.log(productData);

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
                $('#product_status').append(`${response.massage}`);
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

            const productData = {
            name: $("#restockProductName").val(),
            quantity: parseFloat($("#restockQuantity").val())
            };

            console.log(productData);

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
                $('#product_status').append(`${response.massage}`);
            },
            error: function (response) {
                $('#product_status').html("");
                $('#product_status').append(`${response.responseJSON.message}`);
            }
            });
        });
    }

    if(dashboardProductForm){
        dashboardProductForm.addEventListener('submit', e => {
            e.preventDefault();

            const productData = {
            name: $("#productName").val(),
            price: $("#productPrice").val(),
            quantity: $("#productQuantity").val(),
            source: $("#productSource").val(),
            description: $("#productDescription").val(),
            category: $("#productCategory").val()
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
                $('#product_status').html("");
                $('#product_status').append(`${response.massage}`);
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
                $('#fisherman_status').append(`${response.massage}`);
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
                $('#fisherman_status').append(`${response.massage}`);
            },
            error: function (response) {
                $('#fisherman_status').html("");
                $('#fisherman_status').append(`${response.massage}`);
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
                $('#fisherman_status').append(`${response.massage}`);
            },
            error: function (response) {
                $('#fisherman_status').html("");
                $('#fisherman_status').append(`${response.massage}`);
            }
            });
        });
    }
}

// ===== TESTIMONIAL SLIDER =====
function initTestimonialSlider() {
    if (!prevBtn || !nextBtn || !testimonialTrack) return;

    prevBtn.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial - 1 + totalTestimonials) % totalTestimonials;
        updateTestimonialSlider();
    });

    nextBtn.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
        updateTestimonialSlider();
    });

    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
        updateTestimonialSlider();
    }, 5000);
}

function updateTestimonialSlider() {
    testimonialTrack.style.transform = `translateX(-${currentTestimonial * 100}%)`;
}

// ===== HEADER =====
function updateHeaderOnScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 100);
}

function setActiveNavLink() {}

// ===== ANIMATIONS =====
function animateFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((el, i) => {
        el.style.animationDelay = `${i * 0.5}s`;
    });
}