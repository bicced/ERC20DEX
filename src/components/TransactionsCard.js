import { useEffect, useState } from 'react';
import { Card } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { getFilledOrders, getOpenOrders, getExchangeContract } from '../store/slices/exchange';
import { getAccount } from '../store/slices/account';
import { getTradePair } from '../store/slices/tradePair';
import { cancelOrder } from '../store/interactions';
import ReactTable from 'react-table-v6';
import { Button } from 'antd';


function TransactionsCard() {
  const dispatch = useDispatch();
  const account = useSelector(getAccount)
  const exchangeContract = useSelector(getExchangeContract)
  const filledOrders = useSelector(getFilledOrders)
  const openOrders = useSelector(getOpenOrders)
  const tradePair = useSelector(getTradePair)
  const [selected, setSelected] = useState('open')

  const historyColumns = [
    {
      id: 'time',
      Header: 'Time',
      accessor: time => time.formattedTimestamp // String-based value accessors!
    },
    {
      id: 'coin',
      Header: `${tradePair.symbol}`,
      accessor: order => {
        // buy eth sell token
        if (order.tokenGet === "0x0000000000000000000000000000000000000000") {
          return `-${order.tokenAmount / Math.pow(10, tradePair.decimals)}`
        }
        //sell token buy eth
        return `+${order.tokenAmount / Math.pow(10, tradePair.decimals)}`
      }
    },
    {
      id: 'amount',
      Header: `${tradePair.symbol}/ETH`,
      accessor: order => {
        // buy eth sell token
        if (order.tokenGet === "0x0000000000000000000000000000000000000000") {
          return `${order.tokenAmount / order.etherAmount}`
        }
        //sell token buy eth
        return `${order.etherAmount / order.tokenAmount}`
      }
    }
  ]

  const openColumns = [
    {
      id: 'amount',
      Header: 'Amount',
      accessor: order => {
        // buy eth sell token
        if (order.tokenGet === "0x0000000000000000000000000000000000000000") {
          return `-${order.tokenAmount / Math.pow(10, tradePair.decimals)}`
        }
        //sell token buy eth
        return `+${order.tokenAmount / Math.pow(10, tradePair.decimals)}`
      }
    },
    {
      id: 'pair',
      Header: `${tradePair.symbol}/ETH`,
      accessor: order => {
        // buy eth sell token
        if (order.tokenGet === "0x0000000000000000000000000000000000000000") {
          return `${Math.round(order.tokenAmount / order.etherAmount * 100000) / 100000}`
        }
        //sell token buy eth
        return `${Math.round(order.etherAmount / order.tokenAmount * 100000) / 100000}`
      }
    },
    {
      id: 'cancel',
      Header: 'Cancel',
      accessor: order => {
        return (<Button onClick={() => cancelOrder(exchangeContract, order.id, account.address, dispatch)}>Cancel</Button>)
      }
    }
  ]

  useEffect(() => {
    console.log(filledOrders)
  }, [])

  return (
    <Card title="Transactions" extra={<a href="#">More</a>} bodyStyle={{maxHeight: 400, overflow: "auto"}}>
      <Button onClick={() => setSelected('open')}>OPEN ORDERS</Button><Button onClick={() => setSelected('history')}>HISTORY</Button>

      {
        selected === 'open'
        ?
        <ReactTable
          data={openOrders.filter(order => order.user === account.address).sort((a,b) => b.timestamp - a.timestamp)}
          columns={openColumns}
          minRows={0}
          showPagination={false}
          defaultPageSize={200}
          resizable={false}
          className="-striped -highlight"
        />
        :
        <ReactTable
          data={filledOrders.filter(order => order.user === account.address)}
          columns={historyColumns}
          minRows={0}
          showPagination={false}
          defaultPageSize={200}
          resizable={false}
          className="-striped -highlight"
        />
      }
    </Card>
  );
}

export default TransactionsCard;
