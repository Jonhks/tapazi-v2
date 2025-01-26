import { Chart, GoogleChartWrapperChartType } from "react-google-charts";

function TeamPerYearlogGraphic({
  graphType,
}: {
  graphType: GoogleChartWrapperChartType;
}) {
  // chart.draw(data, {
  //   width: 400,
  //   height: 240,
  //   title: "Toppings I Like On My Pizza",
  //   colors: ["#e0440e", "#e6693e", "#ec8f6e", "#f3b49f", "#f6c7b6"],
  //   is3D: true,
  // });

  return (
    <Chart
      // Try different chart types by changing this property with one of: ColumnChart, LineChart, AreaChart, BarChart, BubbleChart, ComboChart,  PieChart, DonutChart, GeoChart, Histogram, Line, RadarChart, ScatterChart, SteppedAreaChart, Table
      chartType={graphType}
      // chartType="ColumnChart"
      data={[
        ["Year", "Sales", "Expenses", "Profit"],
        ["2013", 1000, 400, 300],
        ["2014", 1170, 460, 955],
        ["2015", 660, 1120, 766],
        ["2016", 1030, 540, 455],
      ]}
      options={{
        title: "Average Weight by Age",
        // colors: ["#000", "#ccc", "#fff"],
        is3D: true,
        vAxis: { title: "Age" },
        hAxis: { title: "Weight" },
      }}
      legendToggle
    />
  );
}

export default TeamPerYearlogGraphic;
