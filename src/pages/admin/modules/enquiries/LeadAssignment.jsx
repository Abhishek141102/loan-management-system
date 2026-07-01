function LeadAssignment() {

  const reps = [
    {
      name: "Kunal",
      leads: 15,
      converted: 7,
    },

    {
      name: "Priya",
      leads: 12,
      converted: 5,
    },
  ];

  return (
    <div className="page-container">

      <h2>Lead Assignment</h2>

      <div className="table-container">

        <table className="admin-table">

          <thead>
            <tr>
              <th>Sales Rep</th>
              <th>Assigned Leads</th>
              <th>Converted</th>
            </tr>
          </thead>

          <tbody>

            {reps.map((rep, index) => (

              <tr key={index}>

                <td>{rep.name}</td>
                <td>{rep.leads}</td>
                <td>{rep.converted}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default LeadAssignment;