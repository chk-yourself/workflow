import React from 'react';

const ProjectComposerControlGroup = ({ name, children, className }) => (
  <div className={`project-composer__control-group ${className}`}>
    <h4 className="project-composer__subheading">{name}</h4>
    {children}
  </div>
);

ProjectComposerControlGroup.defaultProps = {
  className: ''
};

export default ProjectComposerControlGroup;
