import { useEffect } from 'react';
import { Card } from 'antd';
import ReactTable from 'react-table-v6'
import { useSelector, useDispatch } from 'react-redux';

function OrderCard() {

  useEffect(() => {
  }, [])

  const data = [{
    name: 'Tanner Linsley',
    age: 26,
    friend: {
      name: 'Jason Maurer',
      age: 23,
    }
  }]

  const columns = [{
    Header: 'Name',
    accessor: 'name' // String-based value accessors!
  }, {
    Header: 'Age',
    accessor: 'age',
    Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
  }, {
    id: 'friendName', // Required because our accessor is not a string
    Header: 'Friend Name',
    accessor: d => d.friend.name // Custom value accessors!
  }, {
    Header: props => <span>Friend Age</span>, // Custom header components!
    accessor: 'friend.age'
  }]


  return (
    <Card title="New Order" extra={<a href="#">More</a>} bodyStyle={{maxHeight: 400, overflow: "auto"}}>
      <ReactTable
        data={data}
        columns={columns}
        minRows={0}
  			showPagination={false}
  			defaultPageSize={200}
  			resizable={false}
  			className="-striped -highlight"
      />
    </Card>
  );
}

export default OrderCard;
