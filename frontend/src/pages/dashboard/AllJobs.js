import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Wrapper from '../../assets/wrappers/JobsContainer'; // Corrected path
import Job from '../../components/Job'; // Corrected path
import { getAllJobs } from '../../features/allJobs/allJobsSlice'; // Corrected path

const AllJobs = () => {
  const { jobs, isLoading } = useSelector((store) => store.allJobs);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllJobs());
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Wrapper>
      <h5>{jobs.length} job{jobs.length > 1 ? 's' : ''} found</h5>
      <div className="jobs">
        {jobs.map((job) => {
          return <Job key={job._id} {...job} />;
        })}
      </div>
    </Wrapper>
  );
};

export default AllJobs;
