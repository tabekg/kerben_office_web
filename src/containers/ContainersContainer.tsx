import {useEffect, useState} from 'react'
import styled from 'styled-components'
import GridComponentsCard from '../components/GridComponentsCard'
import requester from '../utils/requester'

export default function ContainersContainer() {
  const [containers, setContainers] = useState<any[]>([])

  useEffect(() => {
    requester
      .get('/container')
      .then((res) => {
        setContainers(res.payload)
        console.log(res)
      })
      .catch((err) => {
        console.error('Ошибка', err)
      })
  }, [])

  return (
    <ContainerDev>
      <div>
        <BlockContainer>
          <h1>Все</h1>
          <Line></Line>
          <h2>Китай</h2>
          <Line></Line>
          <h2>Узбекистан</h2>
          <Line></Line>
          <h2>Ош</h2>
        </BlockContainer>

        <GeneralgridContainer>
          {containers.map((container) => (
            <GridComponentsCard key={container.id} data={container} />
          ))}
        </GeneralgridContainer>
      </div>
    </ContainerDev>
  )
}

const ContainerDev = styled.div`
  background-color: white;
  width: 1535px;
  height: 700px;
`
const BlockContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 600px;
  margin: 30px;
  color: #6c757d;
`
const Line = styled.div`
  width: 3px;
  height: 40px;
  background-color: #6c757d;
`
const LineBlock = styled.div`
  width: 320px;
  height: 3px;
  background-color: black;
  border-radius: 40px;
`

const GeneralgridContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const GridIten = styled.div`
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  text-align: center;
  padding: 20px;
  font-size: 18px;
  height: 200px;
  width: 700px;
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
