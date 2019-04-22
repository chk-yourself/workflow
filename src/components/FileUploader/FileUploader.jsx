import React, { Component } from 'react';
import { withAuthorization } from '../Session';
import { Input } from '../Input';
import { Button } from '../Button';
import './FileUploader.scss';

class FileUploader extends Component {
  state = {
    selectedFile: null
  };

  uploadFile = e => {
    e.preventDefault();
    const { selectedFile } = this.state;
    const { name, size, type } = selectedFile;
    console.log(name, size, type);
  };

  selectFile = e => {
    this.setState({
      selectedFile: e.target.files[0]
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <form
        className={`file-uploader__form ${classes.form || ''}`}
        onSubmit={this.uploadFile}
      >
        <Input
          onChange={this.selectFile}
          type="file"
          className={`file-uploader__input ${classes.input || ''}`}
        />
        <Button
          type="submit"
          className={`file-uploader__btn ${classes.button || ''}`}
          onClick={this.uploadFile}
        >
          Upload File
        </Button>
      </form>
    );
  }
}

const condition = (currentUser, activeWorkspace) =>
  !!currentUser && !!activeWorkspace;

export default withAuthorization(condition)(FileUploader);
