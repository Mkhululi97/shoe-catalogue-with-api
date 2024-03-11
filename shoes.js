document.addEventListener("alpine:init", () => {
  /* ---------------------- Alpine JS ---------------------- */
  Alpine.data("shoeapi", () => {
    return {
      title: "Shoe-catalogue",
      notificationText: "",
      signUpErrors: "",
      email: "",
      password: "",
      brand: "",
      color: "",
      shoes: [],
      cartShoes: [],
      cartTotal: 0.0,
      size: 0,
      warning: 3,
      paymentAmount: 0,
      itemsInCart: 0,
      showCart: false,
      auth: false,
      signInScreen: false,
      signUpScreen: false,
      paymentBtn: false,
      activeuser: false,
      //FILTERS
      handleChange() {
        //filters by brand size and color
        if (this.brand !== "" && this.size !== "" && this.color !== "") {
          this.shoes = [];
          axios
            .get(
              `https://shoes-api-dkj2.onrender.com/api/shoes/brand/${this.brand}/size/${this.size}/color/${this.color}`
            )
            .then((result) => {
              this.shoes = result.data;
            });
        } //filters by size
        else if (this.size !== "" && this.brand == "" && this.color == "") {
          this.shoes = [];
          axios
            .get(
              `https://shoes-api-dkj2.onrender.com/api/shoes/size/${this.size}`
            )
            .then((result) => {
              this.shoes = result.data;
            });
        } //filters by brand
        else if (this.brand !== "" && this.size == "" && this.color == "") {
          this.shoes = [];
          axios
            .get(
              `https://shoes-api-dkj2.onrender.com/api/shoes/brand/${this.brand}`
            )
            .then((result) => {
              this.shoes = result.data;
            });
        } //filters by color
        else if (this.color !== "" && this.brand == "" && this.size == "") {
          this.shoes = [];
          axios
            .get(
              `https://shoes-api-dkj2.onrender.com/api/shoes/color/${this.color}`
            )
            .then((result) => {
              this.shoes = result.data;
            });
        } //filters by brand and size
        else if (this.brand !== "" && this.size !== "" && this.color == "") {
          this.shoes = [];
          axios
            .get(
              `https://shoes-api-dkj2.onrender.com/api/shoes/brand/${this.brand}/size/${this.size}`
            )
            .then((result) => {
              this.shoes = result.data;
            });
        } //filters by brand and color
        else if (this.brand !== "" && this.color !== "" && this.size == "") {
          this.shoes = [];
          axios
            .get(
              `https://shoes-api-dkj2.onrender.com/api/shoes/brand/${this.brand}/color/${this.color}`
            )
            .then((result) => {
              this.shoes = result.data;
            });
        } //filter by size and color
        else if (this.color !== "" && this.size !== "" && this.brand !== "") {
          this.shoes = [];
          axios
            .get(
              `https://shoes-api-dkj2.onrender.com/api/shoes/size/${this.size}/color/${this.color}`
            )
            .then((result) => {
              this.shoes = result.data;
            });
        }
        //no filters
        else if (this.brand === "" && this.size === "" && this.color === "") {
          this.shoes = [];
          axios
            .get("https://shoes-api-dkj2.onrender.com/api/shoes")
            .then((result) => {
              this.shoes = result.data;
            });
        }
      },
      addToStock(shoeDetails, smallTags) {
        let arrsmallTags = Object.values(smallTags);
        let emptyInputs = [];
        arrsmallTags.forEach((smallTag) => {
          //show error on inputs that have not been filled.
          if (shoeDetails[smallTag.id] === "") {
            //only show error message for the input that was not filled.
            smallTag.className = "";
            //keep track of how many inputs are empty
            emptyInputs.push("");
            setTimeout(() => {
              //hide error on inputs that have not been filled.
              smallTag.className = "hidden";
            }, 2500);
          }
        });
        //submit form
        //make sure all input fields are completed before submission.
        if (emptyInputs.length < 1) {
          //http://localhost:3004/api/shoes
          axios
            .post("https://shoes-api-dkj2.onrender.com/api/shoes", shoeDetails)
            .then((result) => {
              this.notificationText = result.data.message;
            });
          setTimeout(() => {
            window.location.href = "add-shoes.html";
          }, 3500);
        }
      },

      openCart() {
        return (this.showCart = true);
      },

      closeCart() {
        return (this.showCart = false);
      },
      //USERS
      showSignUpScreen() {
        let userstatus = sessionStorage.getItem("activeuser");
        if (!JSON.parse(userstatus)) {
          this.signUpScreen = true;
          this.signInScreen = false;
        }
      },

      closeForm() {
        this.signUpScreen = false;
        this.signInScreen = false;
      },

      showSignInScreen() {
        this.signInScreen = true;
      },

      signUp(email, password) {
        //http://localhost:3004/api/users/signup
        const response = axios.post(
          "https://shoes-api-dkj2.onrender.com/api/users/signup",
          {
            email: email,
            password: password,
            is_admin: false,
          }
        );
        response.then((result) => {
          this.signUpErrors = result.data.message;
          if (
            result.data.message === "User Created" ||
            result.data.message === "mail exist"
          ) {
            setTimeout(() => {
              this.showSignInScreen();
            }, 2500);
          }
          setTimeout(() => {
            this.signUpErrors = "";
          }, 2500);
        });
      },

      signIn(email, password) {
        //http://localhost:3004/api/users/login
        axios
          .post("https://shoes-api-dkj2.onrender.com/api/users/login", {
            email: email,
            password: password,
          })
          .then((result) => {
            let { token, user, itemsInCart } = result.data;
            if (result.data.token) {
              this.email = email;
              this.activeuser = true;
              // this.itemsInCart = result.data.itemsInCart;
              localStorage.setItem("itemsInCart", itemsInCart);
              // localStorage.setItem("itemsInCart", this.itemsInCart);
              sessionStorage.setItem("token", token);
              sessionStorage.setItem("user", JSON.stringify(user));
              sessionStorage.setItem("activeuser", this.activeuser);
              window.location.href = "index.html";
              if (user.is_admin) {
                window.location.href = "add-shoes.html";
              }
              //"https://mkhululi97.github.io/shoe-catalogue-with-api/";
            }
          });
      },
      signOut() {
        //reset itemsInCart to 0
        this.itemsInCart = 0;
        //reset cart total to 0
        this.cartTotal = 0;
        //reset cart shoes to empty array
        this.cartShoes = [];
        //reset activeuser to false
        this.activeuser = false;
        //clear session storage
        sessionStorage.clear();
        //clear local storage
        localStorage.clear();
      },
      addShoeOnCart(shoeid) {
        // const addShoeUrl = "http://localhost:3004/api/cart/add";
        let storedUser = sessionStorage.getItem("user");
        if (storedUser) {
          const addShoeUrl = "https://shoes-api-dkj2.onrender.com/api/cart/add";
          axios
            .post(addShoeUrl, {
              email: this.email,
              shoe_id: shoeid,
            })
            .then((result) => {
              this.itemsInCart = result.data.itemsInCart;
              this.cartShoes = result.data.cart.shoesArr;
              this.cartTotal = result.data.cart.totalCart;
              localStorage.setItem("itemsInCart", this.itemsInCart);
            });
        }
      },
      minusShoeQty(shoeid) {
        // const removeShoeUrl = "http://localhost:3004/api/cart/remove";
        const removeShoeUrl =
          "https://shoes-api-dkj2.onrender.com/api/cart/remove";
        axios
          .post(removeShoeUrl, {
            email: this.email,
            shoe_id: shoeid,
          })
          .then((result) => {
            this.itemsInCart = result.data.itemsInCart;
            this.cartShoes = result.data.cart.shoesArr;
            this.cartTotal = result.data.cart.totalCart;
            localStorage.setItem("itemsInCart", this.itemsInCart);
          });
      },
      deleteShoeFromCart(shoeid) {
        // const deleteShoeUrl = "http://localhost:3004/api/cart/delete";
        const deleteShoeUrl =
          "https://shoes-api-dkj2.onrender.com/api/cart/delete";
        axios
          .post(deleteShoeUrl, {
            email: this.email,
            shoe_id: shoeid,
          })
          .then((result) => {
            this.itemsInCart = result.data.itemsInCart;
            this.cartShoes = result.data.cart.shoesArr;
            this.cartTotal = result.data.cart.totalCart;
            localStorage.setItem("itemsInCart", this.itemsInCart);
          });
      },
      showCartData() {
        // const getCartUrl = `http://localhost:3004/api/cart/${this.email}`;
        const getCartUrl = `https://shoes-api-dkj2.onrender.com/api/cart/${this.email}`;
        axios.get(getCartUrl).then((result) => {
          const cartData = result.data;
          this.cartShoes = cartData.cart.shoesArr;
          this.cartTotal = cartData.cart.totalCart;
          localStorage.setItem("itemsInCart", this.itemsInCart);
        });
      },
      showPaymentBtn() {
        this.paymentBtn = true;
      },
      cartPayment(amount) {
        //http://localhost:3004/api/cart/payment
        axios
          .post("https://shoes-api-dkj2.onrender.com/api/cart/payment", {
            email: this.email,
            payment: amount,
          })
          .then((result) => {
            if (result.data.message === "Payment Successful") {
              //reset itemsInCart to 0
              // this.itemsInCart = 0;
              //reset cart total to 0
              this.cartTotal = 0;
              this.itemsInCart = localStorage.setItem("itemsInCart", 0);
              //reset cart shoes to empty array
              this.cartShoes = [];
              // axios.post("http://localhost:3004/api/cart/sold");
              window.location.href = "success.html";
            }
            if (result.data.message === "Insufficient funds")
              window.location.href = "cancel.html";
            // this.showCartData();
          });
        this.paymentBtn = false;
      },
      init() {
        let storedUser = sessionStorage.getItem("user");
        let userData = JSON.parse(storedUser);
        if (userData !== null) {
          this.email = userData.email;
          this.showCartData();
          this.itemsInCart = localStorage.getItem("itemsInCart") || 0;
          this.activeuser = sessionStorage.getItem("activeuser") || false;
        }
        axios
          //http://localhost:3004/api/shoes
          .get("https://shoes-api-dkj2.onrender.com/api/shoes")
          .then((result) => {
            this.shoes = result.data;
          });
      },
    };
  });
});
