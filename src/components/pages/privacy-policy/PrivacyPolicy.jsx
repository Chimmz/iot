import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PrivacyPolicy.scss';

function PrivacyPolicy() {
   const navigate = useNavigate();
   const goBack = () => navigate(-1);

   return (
      <div className="privacy-policy">
         <div
            className="back w-max-content"
            style={{ cursor: 'pointer' }}
            onClick={goBack}
         >
            <i className="fa fa-angle-left fs-5 me-2 text-primary"></i>
            <span>Back</span>
         </div>
         <h3>
            <span className="text-primary">InsureTek</span> Privacy Policy
         </h3>
         <div className="main-content">
            <div className="text-content">
               <h6>Updated on March 28, 2022</h6>
               <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic
                  facilis voluptates nisi, perferendis iure numquam praesentium
                  similique sunt tenetur sint amet maxime corporis provident
                  odio eum accusamus perspiciatis iusto aperiam? Quisquam
                  tempora repellendus cum laborum fugiat. Nulla quibusdam
                  dolorem, voluptatibus officia quis totam tenetur non obcaecati
                  incidunt placeat adipisci neque eum harum, dignissimos ullam,
                  hic velit. Ipsa quas aut provident repellendus voluptatem
                  vero, sequi non voluptas facere beatae! Consequuntur obcaecati
                  perspiciatis dignissimos doloribus. Incidunt, error omnis
                  placeat corrupti modi voluptates earum. Atque adipisci modi
                  sed laborum rem, fugit enim ad a et cum hic doloremque.
                  Dolorum qui id optio nostrum.
               </p>
            </div>
            <img
               src={process.env.PUBLIC_URL + '/images/privacy-policy-img.jpeg'}
            />
         </div>
      </div>
   );
}

export default PrivacyPolicy;
