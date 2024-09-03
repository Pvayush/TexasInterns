import React from 'react';
import moment from 'moment';
import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import Wrapper from '../assets/wrappers/Job';
import { deleteJob, setEditJob } from '../features/job/jobSlice';

const Job = ({ _id, position, company, jobLocation, jobType, createdAt, status }) => {
  const dispatch = useDispatch();

  const date = moment(createdAt).format('MMM Do, YYYY');

  const handleEdit = () => {
    dispatch(
      setEditJob({
        editJobId: _id,
        position,
        company,
        jobLocation,
        jobType,
        status,
      })
    );
  };

  const handleDelete = () => {
    dispatch(deleteJob(_id));
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
