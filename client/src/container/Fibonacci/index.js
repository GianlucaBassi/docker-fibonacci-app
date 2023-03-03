import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'

const Fibonacci = () => {
  const [indexList, setIndexList] = useState([])
  const indexListInit = useRef(false)

  const [values, setValues] = useState({})
  const valuesInit = useRef(false)

  const [index, setIndex] = useState(null)

  const getCurrentValuesAjax = () => {
    axios
      .get('/api/values/current')
      .then(res => {
        setValues(res.data)

        valuesInit.current = true
      })
      .catch(err => console.log(err))
  }

  const getAllValuesAjax = (setIndexList, indexListInit) => {
    axios
      .get('/api/values/all')
      .then(res => {
        setIndexList(res.data)

        if (!indexListInit.current) {
          indexListInit.current = true
        }
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    if (!valuesInit.current) {
      getCurrentValuesAjax()
    }

    if (!indexListInit.current) {
      getAllValuesAjax(setIndexList, indexListInit)
    }
  }, [])

  const onFormSubmit = async (event) => {
    event.preventDefault()

    await axios.post('/api/values', {
      index
    })

    setIndex(null)

    getCurrentValuesAjax()

    getAllValuesAjax(setIndexList, indexListInit)
  }

  return (
    <div>
      <form
        onSubmit={onFormSubmit}>
        <label>
          Enter your index:
        </label>
        <input
          value={index || ''}
          onChange={(event) => setIndex(event.target.value)} />
        <button>
          Submit
        </button>
      </form>

      <h3>
        Indexes i have seen:
      </h3>
      {indexList?.map(({ number }) => number).join(', ')}

      <h3>
        Calculated values:
      </h3>
      {Object.entries(values)?.map(([key, value]) => (
        <div key={[key, value].join('_')}>
          I calculated {value} for index {key}
        </div>
      ))}
    </div>
  )
}

export default Fibonacci