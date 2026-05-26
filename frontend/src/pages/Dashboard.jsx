function Dashboard() {

  const accessToken = localStorage.getItem("access");

  return (
    <div>

      <h1>Dashboard</h1>

      <p>User Logged In Successfully</p>

      <p>
        Access Token Exists:
        {accessToken ? " YES" : " NO"}
      </p>

    </div>
  );
}

export default Dashboard;