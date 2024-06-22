import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import { Link } from "react-router-dom";

import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024, // For large devices
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768, // For medium devices
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480, // For small devices
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };

  return (
    <div className="mb-4 mt-10">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Slider
          {...settings}
          className="xl:w-[50rem] lg:w-[50rem] md:w-[40rem] sm:w-[20rem] w-full "
        >
          {products.map(
            ({
              image,
              _id,
              name,
              price,
              description,
              brand,
              numReviews,
              rating,
              // createdAt,
              // quantity,
              // countInStock,
            }) => (
              <div key={_id}>
                <Link to={`/product/${_id}`} className="focus:outline-none ">
                  <img
                    src={image}
                    alt={name}
                    className="w-full rounded-lg object-cover h-[20rem] md:h-[25rem] lg:h-[30rem]"
                  />
                  <div className="mt-4   flex flex-col md:flex-row justify-between">
                  <div className="one flex flex-col">
  <div className="flex justify-between items-center">
    <h2 className="font-bold font-montserrat">{name}</h2>
    <p className="bg-pink-100 text-pink-800  font-medium px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
      ₹ {price}
    </p>
  </div>

  <p className="w-full md:w-[25rem] mt-2 text-gray-600 dark:text-gray-400">
    {description.length > 170 ? `${description.substring(0, 170)} ...` : description}
  </p>
</div>

                    <div className="flex flex-col md:flex-row mt-10 justify-between w-full md:w-[20rem]">
                      <div className="one">
                        <h1 className="flex items-center mb-2 md:mb-6">
                          <FaStore className="mr-2 text-black" /> Brand: {brand}
                        </h1>
                        {/* <h1 className="flex items-center mb-2 md:mb-6">
                          <FaClock className="mr-2 text-white" /> Added:
                          {moment(createdAt).fromNow()}
                        </h1> */}
                        <h1 className="flex items-center mb-2 md:mb-6">
                          <FaStar className="mr-2 text-black" /> Reviews:
                          {numReviews}
                        </h1>
                      </div>
                      <div className="two">
                        <h1 className="flex items-center mb-2 md:mb-6">
                          <FaStar className="mr-2 text-black" /> Ratings:
                          {Math.round(rating)}
                        </h1>
                        {/* <h1 className="flex items-center mb-2 md:mb-6">
                          <FaShoppingCart className="mr-2 text-white" /> Quantity:
                          {quantity}
                        </h1>
                        <h1 className="flex items-center mb-2 md:mb-6">
                          <FaBox className="mr-2 text-white" /> In Stock:
                          {countInStock}
                        </h1> */}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )
          )}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;