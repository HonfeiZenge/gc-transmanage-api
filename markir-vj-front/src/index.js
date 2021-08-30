const ambilTransaksi = async () => {
  const uri = 'http://localhost:5000/api/transaction'
  const fetchData = await fetch(uri)
  const response = await fetchData.json()
  const data = await response.data

  return data
}

ambilTransaksi()
  .then(transData => {
    let rr = []
    let i = 0
    transData.forEach(data => {
      rr.push(data)
    })
    const dataTable = document.querySelector('.show__transaction')

    dataTable.innerHTML = ''
    rr.forEach(data => {
      const html = `
      <tr>
        <td class="transaction__table__data py-2">${i++}</td>
        <td class="transaction__table__data">${data.accName}</td>
        <td class="transaction__table__data">${data.accClass}</td>
        <td class="transaction__table__data">${data.goldDeposited}</td>
        <td class="transaction__table__data">${data.goldRate}</td>
        <td class="transaction__table__data">${data.playerDeposit}</td>
        <td class="transaction__table__data">${data.comModal}</td>
        <td class="transaction__table__data">${data.insertedAt}</td>
      </tr>
      `
      dataTable.innerHTML += html
    })
  })