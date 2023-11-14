document.addEventListener("alpine:init", () => {
  /* ---------------------- Alpine JS ---------------------- */
  Alpine.data("shoeapi", () => {
    return {
      title: "Shoe-catalogue",
      shoes: [],
      email: "test@test.com",
      cartShoes: [],
      cartTotal: 0.0,
      open: false,
      showCart: false,

      hideModal() {
        return (this.open = false);
      },
      openCart() {
        return (this.showCart = true);
      },
      closeCart() {
        return (this.showCart = false);
      },

      getCart() {
        const getCartUrl = `https://shoes-api-dkj2.onrender.com/api/cart/${this.email}`;
        return axios.get(getCartUrl);
      },
      addShoeOnCart(shoeid) {
        const addShoeUrl = "https://shoes-api-dkj2.onrender.com/api/cart/add";
        this.open = true;
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
    };
  });
});
