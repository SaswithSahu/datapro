import React, { useState, useEffect } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import "./index.css";

const ProjectDashboard = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    guide: 'vijay',
    councillor: '',
    status: '',
    sortBy: 'deadline',
  });
  const [guides, setGuides] = useState([]);
  const [councillors, setCouncillors] = useState([]);
  const api = process.env.REACT_APP_API;

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${api}/project-admissions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const result = await response.json();
      setData(result);

      const guideSet = new Set(
        result.flatMap(project => [project.guide1, project.guide2])
          .filter(guide => guide.trim() !== '') // Filter out empty strings
      );
      const councillorSet = new Set(result.map(project => project.councillor));

      setGuides([...guideSet]);
      setCouncillors([...councillorSet]);

    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const totalProjects = data.length;
  const completedProjects = data.filter(project => project.status === 'Completed').length;
  const totalAmountReceived = data.reduce((sum, project) => sum + project.feesPaid, 0);
  const totalAmountBalance = data.reduce((sum, project) => sum + (project.totalFees - project.feesPaid), 0);

  const projectCategories = data.reduce((acc, project) => {
    acc[project.projectCategory] = (acc[project.projectCategory] || 0) + 1;
    return acc;
  }, {});

  const councillorProjects = data.reduce((acc, project) => {
    acc[project.councillor] = (acc[project.councillor] || 0) + 1;
    return acc;
  }, {});

  const guideProjects = data.reduce((acc, project) => {
    if (project.guide1.trim() !== '') {
      acc[project.guide1] = (acc[project.guide1] || 0) + 1;
    }
    if (project.guide2.trim() !== '') {
      acc[project.guide2] = (acc[project.guide2] || 0) + 1;
    }
    return acc;
  }, {});
  

  return (
    <div className="project-dashboard">
      <div className="project-dashboard__stats">
        <div className="project-dashboard__stat-box">Total Projects: {totalProjects}</div>
        <div className="project-dashboard__stat-box">Completed Projects: {completedProjects}</div>
        <div className="project-dashboard__stat-box">Total Amount Received: ₹{totalAmountReceived}</div>
      </div>
      <div className="project-dashboard__filters">
        {/* <select name="councillor" value={filters.councillor} onChange={handleFilterChange}>
          <option value="">Select Councillor</option>
          {councillors.map((councillor, index) => (
            <option key={index} value={councillor}>{councillor}</option>
          ))}
        </select> */}
      </div>

      {/* Project Categories Table and Bar Graph */}
      <div className="project-dashboard__councillor-projects">
        <div className="project-dashboard__bar-graph">
          <Bar
            data={{
              labels: Object.keys(councillorProjects),
              datasets: [
                {
                  label: 'Projects Count',
                  data: Object.values(councillorProjects),
                  backgroundColor: 'rgba(75, 192, 192, 0.6)',
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: true,
                },
                tooltip: {
                  callbacks: {
                    label: function(tooltipItem) {
                      return `${tooltipItem.label}: ${tooltipItem.raw}`;
                    }
                  }
                }
              }
            }}
          />
        </div>
        <div className="project-dashboard__categories">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Project Count</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(projectCategories).map(([category, count]) => (
                <tr key={category}>
                  <td>{category}</td>
                  <td>{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      {/* Pie Chart for Amounts */}
      <div className="project-dashboard__amounts">
        <Pie
          data={{
            labels: ['Paid', 'Balance'],
            datasets: [
              {
                data: [totalAmountReceived, totalAmountBalance],
                backgroundColor: ['#36A2EB', '#FF6384'],
              },
            ],
          }}
          options={{ maintainAspectRatio: false }}
        />
      </div>

      {/* Bar Chart for Guide Projects */}
      <div className="project-dashboard__guides">
        <Bar
          data={{
            labels: Object.keys(guideProjects),
            datasets: [
              {
                label: 'Projects Count',
                data: Object.values(guideProjects),
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
              },
            ],
          }}
        />
      </div>

      {/* Pie Chart for Selected Guide's Project Status */}
      <div className="project-dashboard__guide-status">
        <div className="project-dashboard__filters">
          <select name="guide" value={filters.guide} onChange={handleFilterChange}>
            <option value="">Select Guide</option>
            {guides.map((guide, index) => (
            <option key={index} value={guide}>{guide}</option>
          ))}
          </select>
        </div>
        <div className="project-dashboard__guide-status-chart">
          <Pie
            data={{
              labels: ['Completed', 'Ongoing', 'Pending'],
              datasets: [
                {
                  data: [
                    data.filter(project => project.guide1 === filters.guide && project.status === 'Completed').length,
                    data.filter(project => project.guide1 === filters.guide && project.status === 'Ongoing').length,
                    data.filter(project => project.guide1 === filters.guide && project.status === 'Pending').length,
                  ],
                  backgroundColor: ['#4BC0C0', '#FFCE56', '#FF6384'],
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom',
                },
                tooltip: {
                  callbacks: {
                    label: function(tooltipItem) {
                      return `${tooltipItem.label}: ${tooltipItem.raw}`;
                    }
                  }
                }
              }
            }}
          />
        </div>
      </div>
      {/* Line Chart for Fees Collection Over Time */}
      <div className="project-dashboard__fees-timeline">
        <Line
          data={{
            labels: data.map(project => new Date(project.date).toLocaleDateString()),
            datasets: [
              {
                label: 'Fees Collected Over Time',
                data: data.map(project => project.feesPaid),
                fill: false,
                backgroundColor: '#FF6384',
                borderColor: '#FF6384',
              },
            ],
          }}
        />
      </div>
    </div>
  );
};

export default ProjectDashboard;
