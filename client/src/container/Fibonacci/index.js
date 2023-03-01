import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'

const Fibonacci = () => {
  const [indexList, setIndexList] = useState([])
  const indexListInit = useRef(false)

  const [values, setValues] = useState({})
  const valuesInit = useRef(false)

  const [index, setIndex] = useState(null)


  useEffect(() => {
    if (!valuesInit.current) {
      axios
        .get('/api/values/current')
        .then(res => {
          setValues(res)

          valuesInit.current = true
        })
        .catch(err => console.log(err))
    }

    if (!indexListInit.current) {
      axios
        .get('/api/values/all')
        .then(res => {
          setIndexList(res)

          indexListInit.current = true
        })
        .catch(err => console.log(err))
    }
  }, [])

  const onFormSubmit = async (event) => {
    event.preventDefault()

    await axios.post('/api/values', {
      index
    })

    setIndex(null)
  }

  return (
    <div>
      <form
        onSubmit={onFormSubmit}>
        <label>
          Enter your index:
        </label>
        <input
          value={index}
          onChange={(event) => setIndex(event.target.value)} />
        <button>
          Submit
        </button>
      </form>

      <h3>
        Indexes i have seen:
      </h3>
      {indexList.map(({ number }) => number).join(', ')}

      <h3>
        Calculated values:
      </h3>
      {values.map((value, index) => (
        <div key={[index, value].join('_')}>
          For index {index} I calculated {value}
        </div>
      ))}
    </div>
  )
}

export default Fibonacci