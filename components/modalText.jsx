import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

export default function ModalResend(props) {
  const form = React.createRef()
  const [texto, setTexto] = useState(undefined)
  const [validated, setValidated] = useState(false)

  const handleOk = () => {
    setValidated(true)
    if (form.current.checkValidity()) {
      console.log('valid')
      props.onOk(texto)
      setTexto(undefined)
      setValidated(false)
    } else {
      console.log('not valid')
    }
  }

  const handleCancel = () => {
    setValidated(true)
    setTexto(undefined)
    props.onCancel()
  }

  return (
    <>
      <Modal show={props.show} onHide={props.onCancel}>
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{props.text}</p>
          <Form validated={validated} ref={form}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>{props.caption}</Form.Label>
              <Form.Control type="text" value={texto} onChange={(evt) => { setTexto(evt.target.value) }} placeholder="" autoFocus required />
              <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>Cancelar</Button>
          <Button variant="primary" onClick={handleOk}>OK</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}