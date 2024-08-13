import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const PieChart = () => {
  const series = [60, 5, 10, 5, 20];

  const options = {
    labels: ['Presale', 'Marketing', 'Design & Pool', 'Founders', 'Liquidty'],
    dataLabels: {
      enabled: true,
    },

    colors: ["#4669FA", "#F1595C", "#50C793", "#0CE7FA", "#FA916B"],
    legend: {
      position: "top",
      labels: {
        colors: "#fff",
      },
      markers: {
        width: 6,
        height: 6,
        offsetY: -1,
        offsetX: -5,
        radius: 12,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 0,
      },
    },
    responsive: [
      {
        breakpoint: 576, // Adjust based on your design needs
        options: {
          chart: {
            width: "100%",
          },
        },
      },
      {
        breakpoint: 768,
        options: {
          chart: {
            width: "80%",
          },
        },
      },
      {
        breakpoint: 992,
        options: {
          chart: {
            width: "60%",
          },
        },
      },
      {
        breakpoint: 1200,
        options: {
          chart: {
            width: "50%",
          },
        },
      },
    ],
  };

  return (
    <div>
      <Chart options={options} series={series} type="donut"  height="400" width="100%" />
    </div>
  );
};

export default PieChart;
