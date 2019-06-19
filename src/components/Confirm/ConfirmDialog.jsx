import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalFooter, ModalHeader, ModalBody } from '../Modal';
import { Button } from '../Button';
import './ConfirmDialog.scss';

const ConfirmDialog = ({ title, message, onClose, onConfirm, label, intent, classes }) => {
  const buttonRef = useRef(null);
  useEffect(() => {
    buttonRef.current.focus();
  });
  return (
    <Modal onClose={onClose} size="sm" classes={{ content: 'confirm-dialog__content' }}>
      <ModalHeader className={`confirm-dialog__header ${classes.header || ''}`}>
        <h4 className="modal__title">{title}</h4>
      </ModalHeader>
      <ModalBody className={`confirm-dialog__body ${classes.body || ''}`}>
        <p className="modal__text">{message}</p>
      </ModalBody>
      <ModalFooter className={`confirm-dialog__footer ${classes.footer || ''}`}>
        <Button innerRef={buttonRef} onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" intent={intent} onClick={onConfirm}>
          {label}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

ConfirmDialog.defaultProps = {
  classes: {
    header: '',
    body: '',
    footer: ''
  },
  label: 'Ok',
  intent: ''
};

ConfirmDialog.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string),
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  label: PropTypes.string,
  intent: PropTypes.string
};

export default ConfirmDialog;
