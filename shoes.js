document.addEventListener("alpine:init", () => {
  /* ---------------------- Alpine JS ---------------------- */
  Alpine.data("shoeapi", () => {
    return {
      title: "Shoe-catalogue",
      shoes: [],
      signUpErrors: "",
      email: "test@test.com",
      password: "",
      cartShoes: [],
      cartTotal: 0.0,
      showCart: false,
      userExists: true,
      auth: false,
      openCart() {
        return (this.showCart = true);
      },
      closeCart() {
        return (this.showCart = false);
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
        response.then((res) => {
          this.signUpErrors = res.data.message;
          if (res.data.message !== "User Created") {
            //turn userExists to true
            this.userExists = false;
            //x:bind href to login.html
            //show login form
          }

          setTimeout(() => {
            this.signUpErrors = "";
          }, 2500);
        });
        return this.userExists;
      },
      signIn(email, password) {
        // "https://shoes-api-dkj2.onrender.com/api/users/login",
        const response = axios.post("http://localhost:3004/api/users/login", {
          email: email,
          password: password,
        });
        console.log(email, password);
        response.then((res) => console.log(res));
      },
      getCart() {
        const getCartUrl = `https://shoes-api-dkj2.onrender.com/api/cart/${this.email}`;
        return axios.get(getCartUrl);
      },
      addShoeOnCart(shoeid) {
        const addShoeUrl = "https://shoes-api-dkj2.onrender.com/api/cart/add";

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
      showCartData() {
        this.getCart().then((result) => {
          const cartData = result.data;
          this.cartShoes = cartData.cart.shoesArr;
          this.cartTotal = cartData.cart.totalCart;
        });
      },
      init() {
        axios
          .get("https://shoes-api-dkj2.onrender.com/api/shoes")
          .then((result) => {
            this.shoes = result.data;
          });
        this.showCartData();
      },
      addShoeToCart(shoeid) {
        this.addShoeOnCart(shoeid).then(() => {
          this.showCartData();
        });
      },
      removeShoeFromCart(shoeid) {
        this.removeShoeOnCart(shoeid).then(() => {
          this.showCartData();
        });
      },
      deleteShoeFromCart(shoeid) {
        const deleteShoeUrl =
          "https://shoes-api-dkj2.onrender.com/api/cart/delete";
        axios.post(deleteShoeUrl, {
          shoe_id: shoeid,
        });
        this.showCartData();
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
