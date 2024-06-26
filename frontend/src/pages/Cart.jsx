import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";
const addToCartHandler = (product, qty) => {
  dispatch(addToCart([...product, qty]));
};


const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product,qty)=>{
    dispatch(addToCart({...product,qty}))
  }
  
  const removeFromCartHandler = (id)=> {
    dispatch(removeFromCart(id))
  }

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping')
  }
  const styles = {
    container: {
      textAlign: 'center',
      marginTop: '2px',
    },
    lottie: {
      width: '100%',
      height: '400px',
      maxWidth: '800px',
      margin: '20px 0',
    },
    link: {
      color: '#ff69b4',
      fontWeight: '600',
      textDecoration: 'none',
      marginBottom: '10px',
      marginTop: '30px',
    },
  };

  return (
  
    <div className="container flex justify-around items-start flex-wrap max-auto mt-20">
    {cartItems.length === 0 ? (
  <div style={styles.container}>
    Your cart is empty
    <iframe 
            src="https://lottie.host/embed/e3a62917-9e54-447a-b3f7-28fd253601ec/AXDwZdfch5.json" 
            style={styles.lottie}
           
            allowFullScreen
          ></iframe>
     <Link
            to="/shop"
            style={styles.link}
            onMouseEnter={e => e.target.style.textDecoration = 'underline'}
            onMouseLeave={e => e.target.style.textDecoration = 'none'}
          >
            ⬅️ Go To Shop
          </Link>
  </div>
): (
        <>
          <div className="flex flex-col w-[80%]">
          <Link
          to="/"
          className="text-pink-900 font-semibold hover:underline mb-10 "
        > 
         ⬅️ Go Back 
        </Link>
            <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center mb-4 md:mb-8 pb-4 border-b border-gray-300 ">
                <div className="w-[9rem] h-[5rem] md:w-[8rem] md:h-[8rem]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="flex-1 ml-2 mr-2">
                  <Link to={`/product/${item._id}`} className="text-pink-500">
                    {item.name}{" "}
                  </Link>
                  {/* <div className="mt-2 text-white">{item.brand}</div> */}
                  <div className="mt-2 text-black">₹ {item.price}</div>
                </div>
                <div className="w-[8rem]  md:w-[10rem] ">
                  <select
                    className="w-full  m-1 p-1 border rounded text-black"
                    value={item.qty}
                    onChange={(e) =>
                      addToCartHandler(item, Number(e.target.value))
                    }
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <button
                    className="text-red-500 mr-[5rem]"
                    onClick={() => removeFromCartHandler(item._id)}
                  >
                    <FaTrash className="ml-[1rem] mt-[0.5rem] " />{" "}
                  </button>
                </div>
              </div>
            ))}
               <div className="mt-8 w-full md:w-[40rem] ">
                <div className="p-4 rounded-lg">
                  <h2 className=" text-xl font-semibold mb-2 text-white">
                    Items({cartItems.reduce((acc,item)=> acc+item.qty,0)})
                  </h2>
                  <div className="text-2xl font-bold text-white">
                  ₹{cartItems.reduce((acc,item)=> acc + item.qty * item.price,0)
                  .toFixed(2) }
                  </div>
                  <button className="bg-pink-500 mt-4 py-2 px-4 rounded-full text-lg w-full"
                  disabled = {cartItems.length === 0} 
                  onClick={checkoutHandler}
                  >
                  
                    Proceed to CheckOut
                  </button>
                </div>
               </div>

          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
