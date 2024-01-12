document.addEventListener("alpine:init", () => {
  /* ---------------------- Alpine JS ---------------------- */
  Alpine.data("shoeapi", () => {
    return {
      title: "Shoe-catalogue",
      shoes: [],
      signUpErrors: "",
      email: "",
      password: "",
      cartShoes: [],
      cartTotal: 0.0,
      showCart: false,
      userExists: true,
      auth: false,
      brand: "",
      size: 0,
      color: "",
      warning: 3,
      signInScreen: false,
      signUpScreen: false,
      paymentBtn: false,
      activeuser: true,
      paymentAmount: 0,
      itemsInCart: 0,
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
        //"http://localhost:3004/api/users/login",
        axios
          .post("https://shoes-api-dkj2.onrender.com/api/users/login", {
            email: email,
            password: password,
          })
          .then((result) => {
            let { token, user } = result.data;
            if (result.data.token) {
              this.email = email;
              sessionStorage.setItem("token", token);
              sessionStorage.setItem("user", JSON.stringify(user));
              sessionStorage.setItem("activeuser", this.activeuser);
              window.location.href =
                "https://mkhululi97.github.io/shoe-catalogue-with-api/";
            }
          });
      },
      getCart() {
        const getCartUrl = `https://shoes-api-dkj2.onrender.com/api/cart/${this.email}`;
        return axios.get(getCartUrl);
      },
      showCartData() {
        this.getCart().then((result) => {
          const cartData = result.data;
          this.cartShoes = cartData.cart.shoesArr;
          this.cartTotal = cartData.cart.totalCart;
        });
      },
      addShoeOnCart(shoeid) {
        const addShoeUrl = "https://shoes-api-dkj2.onrender.com/api/cart/add";
        this.showCartData();
        return axios.post(addShoeUrl, {
          email: this.email,
          shoe_id: shoeid,
        });
      },
      removeShoeOnCart(shoeid) {
        return axios.post(
          "https://shoes-api-dkj2.onrender.com/api/cart/remove",
          {
            email: this.email,
            shoe_id: shoeid,
          }
        );
      },
      deleteShoeFromCart(shoeid) {
        const deleteShoeUrl =
          "https://shoes-api-dkj2.onrender.com/api/cart/delete";
        axios.post(deleteShoeUrl, {
          shoe_id: shoeid,
        });
        this.showCartData();
      },
      showPaymentBtn() {
        this.paymentBtn = true;
      },
      cartPayment(amount) {
        axios
          .post("https://shoes-api-dkj2.onrender.com/api/cart/payment", {
            email: this.email,
            payment: amount,
          })
          .then((result) => {
            if (result.data.message === "Payment Successful")
              window.location.href = "success.html";
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
        }
        axios
          .get("https://shoes-api-dkj2.onrender.com/api/shoes")
          .then((result) => {
            this.shoes = result.data;
          });
        this.itemsInCart = localStorage.getItem("itemsInCart") && 0;
        this.showCartData();
      },
      addShoeToCart(shoeid) {
        this.addShoeOnCart(shoeid).then((result) => {
          this.itemsInCart = result.data.itemsInCart;
          localStorage.setItem("itemsInCart", this.itemsInCart);
          this.showCartData();
        });
      },
      removeShoeFromCart(shoeid) {
        this.removeShoeOnCart(shoeid).then((result) => {
          this.itemsInCart = result.data.itemsInCart;
          localStorage.setItem("itemsInCart", this.itemsInCart);
          this.showCartData();
        });
      },
      checkuser() {
        if (userExists) {
          alert("returns");
        } else {
          alert("new");
        }
      },
    };
  });
});
