// Copyright (C) 2020-2022 Intel Corporation
// Copyright (C) 2023 CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

import React, { useState } from 'react';
import moment from 'moment';
import { Row, Col } from 'antd/lib/grid';
import Title from 'antd/lib/typography/Title';
import Text from 'antd/lib/typography/Text';

import { getCore, Project } from 'cvat-core-wrapper';
import LabelsEditor from 'components/labels-editor/labels-editor';
import UserSelector from 'components/task-page/user-selector';
// import BugTrackerEditor from 'components/task-page/bug-tracker-editor';

const core = getCore();

interface DetailsComponentProps {
    project: Project;
    onUpdateProject: (project: Project) => void;
}

export default function DetailsComponent(props: DetailsComponentProps): JSX.Element {
    const { project, onUpdateProject } = props;
    const [projectName, setProjectName] = useState(project.name);

    return (
        <div data-cvat-project-id={project.id} className='cvat-project-details' style={{ color: 'white' }}>
            <Row>
                <Col>
                    <Title
                        level={4}
                        editable={{
                            onChange: (value: string): void => {
                                setProjectName(value);
                                project.name = value;
                                onUpdateProject(project);
                            },
                        }}
                        className='cvat-project-name'
                        style={{ color: 'white' }}
                    >
                        {projectName}
                    </Title>
                </Col>
            </Row>
            <Row justify='space-between' className='cvat-project-description'>
                <Col>
                    <Text style={{ color: 'white' }} type='secondary'>
                        {`Project #${project.id} created`}
                        {project.owner ? ` by ${project.owner.username}` : null}
                        {` on ${moment(project.createdDate).format('MMMM Do YYYY')}`}
                    </Text>
                    {/* <BugTrackerEditor
                        instance={project}
                        onChange={(bugTracker): void => {
                            project.bugTracker = bugTracker;
                            onUpdateProject(project);
                        }}
                    /> */}
                </Col>
                {/* <Col>
                    <Text style={{ color: 'white' }} type='secondary'>Assigned to</Text>
                    <UserSelector
                        value={project.assignee}
                        onSelect={(user) => {
                            project.assignee = user;
                            onUpdateProject(project);
                        }}
                    />
                </Col> */}
            </Row>
            <LabelsEditor
                labels={project.labels.map((label: any): string => label.toJSON())}
                style={{ color: 'white' }}
                onSubmit={(labels: any[]): void => {
                    project.labels = labels.map((labelData): any => new core.classes.Label(labelData));
                    onUpdateProject(project);
                }}
            />
        </div>
    );
}
