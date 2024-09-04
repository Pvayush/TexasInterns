import main from '../assets/images/main.svg';
import Wrapper from '../assets/wrappers/LandingPage';
import { Logo } from '../components';
import { Link } from 'react-router-dom';
const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className='container page'>
        {/* info */}
        <div className='info'>
          <h1>
            Internship <span>tracking</span> app
          </h1>
          <p>
            Texas Interns is an app that allows UT Austin CS/Engineering students to keep 
            track of their many internship processes at various companies
            and organizations all in one space. If you have any issues with this 
            app or reccomendations/criticisms, please let me know at pvayush@utexas.edu Blash blash blah

          </p>
          <p>
            Try the demo app by clicking 'Login/Register'!
          </p>
          <Link to='/register' className='btn btn-hero'>
            Login/Register
          </Link>
        </div>
        <img src={main} alt='job hunt' className='img main-img' />
      </div>
    </Wrapper>
  );
};

export default Landing;
