import { useEffect } from 'react';
import { Card } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { getAccount } from '../store/slices/account';

function BalanceCard() {
  const account = useSelector(getAccount)

  useEffect(() => {
    console.log(account)
  }, [])

  return (
    <Card title="Balance" extra={<a href="#">More</a>} bodyStyle={{maxHeight: 400, overflow: "auto"}}>
      <div>ETH: {account.ethBalance / Math.pow(10, 18)}</div>
      <div>TOKENS:</div>
    </Card>
  );
}

export default BalanceCard;
