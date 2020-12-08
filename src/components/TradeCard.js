import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTokenList } from '../store/slices/tokenList';
import { getTradePair } from '../store/slices/tradePair';
import tradePairSlice from '../store/slices/tradePair';
import { List, SearchBar } from 'antd-mobile';
import { Card } from 'antd';


const Item = List.Item;
const Brief = Item.Brief;

function TradeCard() {
  const dispatch = useDispatch();
  const totalTokenList = useSelector(getTokenList);
  const tradePair = useSelector(getTradePair);
  const [search, setSearch] = useState("");

  useEffect(() => {
    console.log(tradePair)
  }, [tradePair])


  return (
    <Card title={`Trade  ETHer/${tradePair.symbol}`} extra={<a href="#">More</a>} bodyStyle={{maxHeight: 800, overflow: "auto"}}>
      <SearchBar onChange={(input) => setSearch(input.toUpperCase())} />
      <List className="TradeCard">
        {
          totalTokenList.map(contract => {
            if (contract.name.toUpperCase().includes(search) || contract.symbol.toUpperCase().includes(search) || contract.address.toUpperCase().includes(search)) {
              return (
                <Item onClick={() => dispatch(tradePairSlice.actions.set(contract))} extra="10:30" thumb={contract.logoURI} multipleLine>
                  {contract.symbol} - {contract.name} <Brief>{contract.address}</Brief>
                </Item>
              )
            }
          })
        }
      </List>
    </Card>

  );
}

export default TradeCard;
