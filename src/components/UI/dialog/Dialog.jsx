import React from 'react';

// External components
import Backdrop from '../backdrop/Backdrop';
import './Dialog.scss';

const DialogHeader = props => {
   return <div className="dialog-header">{props.children}</div>;
};

const DialogBody = props => <div className="dialog-body">{props.children}</div>;
const DialogFooter = props => (
   <div className="dialog-footer">{props.children}</div>
);

class Dialog extends React.Component {
   static Header = DialogHeader;
   static Body = DialogBody;
   static Footer = DialogFooter;

   constructor(props) {
      super(props);
   }

   render() {
      return (
         <>
            <div className="dialog shadow-lg">
               {this.props.children}
               {this.props.closable && (
                  <button
                     type="button"
                     className="btn-close"
                     data-bs-dismiss="modal"
                     aria-label="Close"
                     onClick={this.props.close}
                  ></button>
               )}
            </div>
            <Backdrop
               show
               blur={this.props.blurBackdrop}
               onClick={this.props.close}
            />
         </>
      );
   }
}

export default Dialog;
