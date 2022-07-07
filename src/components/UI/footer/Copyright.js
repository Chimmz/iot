import { Link } from 'react-router-dom';
import './Copyright.css'

const Copyright =() =>{
    return (
        <p className='fs10 copyright position-absolute start-50 translate-middle-x bottom-0'>
            <span className="line-1" >© Copyright Insuretek, 2022</span>
            <span className="conditional-pipe" > | </span> {/* hide this character in smaller screens */}
            <span className="d-block d-md-inline-block">All Rights Reserved |{' '}
            <Link to="/">Privacy Policy</Link></span>
        </p>
    )
}

export default Copyright;