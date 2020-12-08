import { useEffect } from 'react';
import { Card } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { getFilledOrders, getChartData } from '../store/slices/exchange';
import ApexCharts from 'apexcharts';
import ReactApexChart from "react-apexcharts";
import moment from 'moment';

function ChartCard() {
  const filledOrders = useSelector(getFilledOrders)
  const chartData = useSelector(getChartData)

  const options = {
              chart: {
                height: 350,
                type: 'candlestick',
              },
              title: {
                text: 'CandleStick Chart - Category X-axis',
                align: 'left'
              },
              annotations: {
                xaxis: [
                  {
                    x: 'Oct 06 14:00',
                    borderColor: '#00E396',
                    label: {
                      borderColor: '#00E396',
                      style: {
                        fontSize: '12px',
                        color: '#fff',
                        background: '#00E396'
                      },
                      orientation: 'horizontal',
                      offsetY: 7,
                      text: 'Annotation Test'
                    }
                  }
                ]
              },
              tooltip: {
                enabled: true,
              },
              xaxis: {
                type: 'category',
                labels: {
                  formatter: function(val) {
                    return moment(val).format('MMM DD HH:mm')
                  }
                }
              },
              yaxis: {
                tooltip: {
                  enabled: true
                }
              }
            }

  useEffect(() => {
    console.log(chartData)
  }, [])

  return (
    <Card title="Balance" extra={<a href="#">More</a>} bodyStyle={{maxHeight: 400, overflow: "auto"}}>
      <ReactApexChart options={options} series={chartData} type="candlestick" height={350} />
    </Card>
  );
}

export default ChartCard;
