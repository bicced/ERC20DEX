import { useEffect } from 'react';
import { Card } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { getOpenOrders } from '../store/slices/exchange';
import { getTradePair } from '../store/slices/tradePair';
import ReactTable from 'react-table-v6'


function OrderbookCard() {
  const openOrders = useSelector(getOpenOrders)
  const tradePair = useSelector(getTradePair)

  const sellColumns = [
    {
      id: 'coin',
      accessor: order => {
        return order.tokenAmount / Math.pow(10, tradePair.decimals)
      }
    },
    {
      id: 'amount',
      accessor: order => order.tokenPrice
    },
    {
      id: 'eth',
      accessor: order => {
        return order.etherAmount / Math.pow(10, 18)
      }
    }
  ]

  const buyColumns = [
    {
      id: 'coin',
      Header: `${tradePair.symbol}`,
      accessor: order => {
        return order.tokenAmount / Math.pow(10, tradePair.decimals)
      }
    },
    {
      id: 'amount',
      Header: `${tradePair.symbol}/ETH`,
      accessor: order => order.tokenPrice
    },
    {
      id: 'eth',
      Header: `ETH`,
      accessor: order => {
        return order.etherAmount / Math.pow(10, 18)
      }
    }
  ]

  const middle = [{
    Header: `${tradePair.symbol}`,
  }]

  useEffect(() => {
  }, [])

  return (
    <Card title="Orderbook" extra={<a href="#">More</a>} bodyStyle={{maxHeight: 800, overflow: "auto"}}>
      <ReactTable
        data={openOrders.filter(order => order.tokenGet === "0x0000000000000000000000000000000000000000")}
        columns={sellColumns}
        minRows={0}
        showPagination={false}
        defaultPageSize={200}
        resizable={false}
        TheadComponent={_ => null}
        className="-striped -highlight"
      />
      <ReactTable
        data={openOrders.filter(order => order.tokenGet !== "0x0000000000000000000000000000000000000000")}
        columns={buyColumns}
        minRows={0}
        showPagination={false}
        defaultPageSize={200}
        resizable={false}
        className="-striped -highlight"
      />
    </Card>
  );
}

export default OrderbookCard;
