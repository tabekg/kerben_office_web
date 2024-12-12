import styled from 'styled-components'
import {CgArrowLongRight} from 'react-icons/cg'

export default function ContainerCardComponent({data}: {data: any}) {
  const colorStyle = {color: data.is_empty ? 'green' : 'red'}

  const cargoCity = data.point !== null

  return (
    <div>
      <div>
        <GridContainers>
          <GridIten>
            <Div>
              <h4>Номер контейнера: {data.number}</h4>
              <RoundBlock style={colorStyle}></RoundBlock>
            </Div>
            <h5>Номер транспорта: {data.vehicle_state_number || '-'}</h5>
            <LineBlock></LineBlock>
            {cargoCity ? (
              <Div>
                <h5>{data.point?.title?.ru || '-'}</h5>
              </Div>
            ) : (
              <Div>
                <h5>{data.from_point?.title?.ru || '-'}</h5>
                <CgArrowLongRight style={{fontSize: '30px'}} />
                <h5>{data.to_point?.title?.ru || '-'}</h5>
              </Div>
            )}
          </GridIten>
        </GridContainers>
      </div>
    </div>
  )
}

const LineBlock = styled.div`
  width: 320px;
  height: 3px;
  background-color: black;
  border-radius: 40px;
`

const GridContainers = styled.div`
  /* display: grid; */
  display: flex;
  justify-content: center;
  align-items: center;
  /* grid-template-columns: repeat(2, 1fr); */
  gap: 15px;
  margin: 10px;
`

const GridIten = styled.div`
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  text-align: center;
  padding: 20px;
  font-size: 18px;
  height: 200px;
  width: 390px;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`

const RoundBlock = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: red;
  border: 1px solid gray;
`
const Div = styled.div`
  display: flex;
  justify-content: space-between;
`
