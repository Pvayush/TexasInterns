import React, { useState } from 'react';
import moment from 'moment';
import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from 'react-icons/fa';
import Wrapper from '../assets/wrappers/Job';

// Simulate fetching demo jobs from localStorage
const fetchDemoJobs = () => {
  const demoJobs = JSON.parse(localStorage.getItem('demoJobs')) || [];
  return demoJobs;
};

// Simulate updating demo jobs in localStorage
const updateDemoJobs = (jobs) => {
  localStorage.setItem('demoJobs', JSON.stringify(jobs));
};

const Job = ({ _id, position, company, jobLocation, jobType, createdAt, status, setJobs }) => {
  const date = moment(createdAt).format('MMM Do, YYYY');

  const handleEdit = () => {
    const demoJobs = fetchDemoJobs();
    const jobIndex = demoJobs.findIndex((job) => job._id === _id);
    if (jobIndex > -1) {
      const editedJob = { ...demoJobs[jobIndex], position, company, jobLocation, jobType, status };
      demoJobs[jobIndex] = editedJob;
      updateDemoJobs(demoJobs);
      setJobs(demoJobs); // Update the local state
    }
  };

  const handleDelete = () => {
    const demoJobs = fetchDemoJobs();
    const updatedJobs = demoJobs.filter((job) => job._id !== _id);
    updateDemoJobs(updatedJobs);
    setJobs(updatedJobs); // Update the local state
  };

  return (
    <Wrapper>
      <header>
        <div className='main-icon'>{company.charAt(0)}</div>
        <div className='info'>
          <h5>{position}</h5>
          <p>{company}</p>
        </div>
      </header>
      <div className='content'>
        {/* Content Center */}
        <div className='content-center'>
          <div className='job-info'>
            <FaLocationArrow />
            <span>{jobLocation}</span>
          </div>
          <div className='job-info'>
            <FaCalendarAlt />
            <span>{date}</span>
          </div>
          <div className='job-info'>
            <FaBriefcase />
            <span>{jobType}</span>
          </div>
          <div className={`status ${status}`}>{status}</div>
        </div>
        {/* Footer */}
        <footer>
          <div className='actions'>
            <button type='button' className='btn edit-btn' onClick={handleEdit}>
              Edit
            </button>
            <button type='button' className='btn delete-btn' onClick={handleDelete}>
              Delete
            </button>
          </div>
        </footer>
      </div>
    </Wrapper>
  );
};

export default Job;
