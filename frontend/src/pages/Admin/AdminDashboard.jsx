import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
  const { data: sales, isLoading: isLoadingSales } = useGetTotalSalesQuery();
  const { data: customers, isLoading: isLoadingCustomers } = useGetUsersQuery();
  const { data: orders, isLoading: isLoadingOrders } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [state, setState] = useState({
    options: {
      chart: {
        type: "line",
        id: "sales-trend-chart",
        zoom: {
          enabled: true,
        },
      },
      tooltip: {
        theme: "dark",
      },
      colors: ["#00E396"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Sales Trend",
        align: "left",
        style: {
          fontSize: '16px',
          color: '#666',
        },
      },
      grid: {
        borderColor: "#ccc",
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
          style: {
            color: '#333',
            fontSize: '12px',
          },
        },
        labels: {
          style: {
            colors: '#333',
          },
        },
      },
      yaxis: {
        title: {
          text: "Sales",
          style: {
            color: '#333',
            fontSize: '12px',
          },
        },
        labels: {
          style: {
            colors: '#333',
          },
        },
        min: 0,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      console.log('Formatted Sales Date:', formattedSalesDate);

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: formattedSalesDate.map((item) => item.x),
          },
        },
        series: [
          { name: "Sales", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }
  }, [salesDetail]);

  return (
    <>
      <AdminMenu />

      <section className="mt-20">
        <div className="w-full flex flex-wrap justify-center xl:justify-start xl:space-x-8 xl:px-20">
          <div className="rounded-lg bg-black p-5 w-full sm:w-[20rem] mt-5 mx-2">
            <div className="font-bold rounded-full w-[3rem] bg-pink-500 text-center p-3">
              ₹
            </div>
            <p className="mt-5 text-white">Sales</p>
            <h1 className="text-xl font-bold text-white">
              ₹ {isLoadingSales ? <Loader /> : sales.totalSales.toFixed(2)}
            </h1>
          </div>
          <div className="rounded-lg bg-black p-5 w-full sm:w-[20rem] mt-5 mx-2">
            <div className="font-bold rounded-full w-[3rem] bg-pink-500 text-center p-3">
              ₹
            </div>
            <p className="mt-5 text-white">Customers</p>
            <h1 className="text-xl font-bold text-white">
              {isLoadingCustomers ? <Loader /> : customers?.length}
            </h1>
          </div>
          <div className="rounded-lg bg-black p-5 w-full sm:w-[20rem] mt-5 mx-2">
            <div className="font-bold rounded-full w-[3rem] bg-pink-500 text-center p-3">
              ₹
            </div>
            <p className="mt-5 text-white">All Orders</p>
            <h1 className="text-xl font-bold text-white">
              {isLoadingOrders ? <Loader /> : orders?.totalOrders}
            </h1>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Chart
            options={state.options}
            series={state.series}
            type="line"
            className="w-full max-w-screen-xl"
          />
        </div>

        <div className="mt-10 mb-20">
          <OrderList />
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
