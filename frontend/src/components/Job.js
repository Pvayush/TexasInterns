import Wrapper from '../assets/wrappers/Job'; // Correct path for the styled component
import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import JobInfo from './JobInfo'; // Ensure the path to JobInfo is correct
import moment from 'moment';
import { deleteJob, setEditJob } from '../features/job/jobSlice'; // Correct import path for jobSlice

const Job = ({ _id, position, company, jobLocation, jobType, createdAt, status }) => {
  const dispatch = useDispatch();

  const date = moment(createdAt).format('MMM Do, YYYY');

  const handleDelete = () => {
    dispatch(deleteJob(_id));
  };

  const handleEdit = () => {
    dispatch(setEditJob({
      editJobId: _id,
      position,
      company,
      jobLocation,
      jobType,
      status,
    }));
  };

  return (
    <Wrapper>
      <header>
        <div className="main-icon">{company.charAt(0)}</div>
        <div className="info">
          <h5>{position}</h5>
          <p>{company}</p>
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          <JobInfo icon={<FaLocationArrow />} text={jobLocation} />
          <JobInfo icon={<FaCalendarAlt />} text={date} />
          <JobInfo icon={<FaBriefcase />} text={jobType} />
          <div className={`status ${status}`}>{status}</div>
        </div>
        <footer>
          <div className="actions">
            <button type="button" className="btn edit-btn" onClick={handleEdit}>Edit</button>
            <button type="button" className="btn delete-btn" onClick={handleDelete}>Delete</button>
          </div>
        </footer>
      </div>
    </Wrapper>
  );
};

export default Job;
