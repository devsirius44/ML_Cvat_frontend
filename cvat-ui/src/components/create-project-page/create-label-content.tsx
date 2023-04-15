/* eslint-disable @typescript-eslint/no-unused-vars */
// Copyright (C) 2020-2022 Intel Corporation
// Copyright (C) 2022-2023 CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

import React, { RefObject, useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { Col, Row } from 'antd/lib/grid';
import Text from 'antd/lib/typography/Text';
import Form, { FormInstance } from 'antd/lib/form';
import { createProjectAsync } from 'actions/projects-actions';
import { StorageLocation } from 'reducers';
import Button from 'antd/lib/button';
import notification from 'antd/lib/notification';
import Input from 'antd/lib/input';
import { Storage, StorageData } from 'cvat-core-wrapper';

import LabelsEditor from 'components/labels-editor/labels-editor';
// import Collapse from 'antd/lib/collapse';
import patterns from 'utils/validation-patterns';
import SourceStorageField from 'components/storage/source-storage-field';
import TargetStorageField from 'components/storage/target-storage-field';

interface AdvancedConfiguration {
    sourceStorage: StorageData;
    targetStorage: StorageData;
    bug_tracker?: string | null;
}

const initialValues: AdvancedConfiguration = {
    bug_tracker: null,
    sourceStorage: {
        location: StorageLocation.LOCAL,
        cloudStorageId: undefined,
    },
    targetStorage: {
        location: StorageLocation.LOCAL,
        cloudStorageId: undefined,
    },
};

interface AdvancedConfigurationProps {
    formRef: RefObject<FormInstance>;
    sourceStorageLocation: StorageLocation;
    targetStorageLocation: StorageLocation;
    onChangeSourceStorageLocation?: (value: StorageLocation) => void;
    onChangeTargetStorageLocation?: (value: StorageLocation) => void;
}

function NameConfigurationForm({
    formRef,
    inputRef,
}: {
    formRef: RefObject<FormInstance>;
    inputRef: RefObject<Input>;
}): JSX.Element {
    return (
        <Form layout='vertical' ref={formRef}>
            <Form.Item
                name='name'
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: 'Please, specify a name',
                    },
                ]}
            >
                <Input
                    placeholder='Insert Project Name'
                    ref={inputRef}
                    className='project-label'
                    style={{
                        backgroundColor: '#0C1543',
                        border: 'none',
                        padding: '10px',
                        borderRadius: '6px',
                        color: 'white',
                        fontSize: '18px',
                    }}
                />
            </Form.Item>
        </Form>
    );
}

function AdvancedConfigurationForm(props: AdvancedConfigurationProps): JSX.Element {
    const {
        formRef,
        sourceStorageLocation,
        targetStorageLocation,
        onChangeSourceStorageLocation,
        onChangeTargetStorageLocation,
    } = props;
    return (
        <Form layout='vertical' ref={formRef} initialValues={initialValues}>
            <Form.Item
                name='bug_tracker'
                label='Issue tracker'
                extra='Attach issue tracker where the project is described'
                hasFeedback
                rules={[
                    {
                        validator: (_, value, callback): void => {
                            if (value && !patterns.validateURL.pattern.test(value)) {
                                callback('Issue tracker must be URL');
                            } else {
                                callback();
                            }
                        },
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Row justify='space-between'>
                <Col span={11}>
                    <SourceStorageField
                        instanceId={null}
                        storageDescription='Specify source storage for import resources like annotation, backups'
                        locationValue={sourceStorageLocation}
                        onChangeLocationValue={onChangeSourceStorageLocation}
                    />
                </Col>
                <Col span={11} offset={1}>
                    <TargetStorageField
                        instanceId={null}
                        storageDescription='Specify target storage for export resources like annotation, backups'
                        locationValue={targetStorageLocation}
                        onChangeLocationValue={onChangeTargetStorageLocation}
                    />
                </Col>
            </Row>
        </Form>
    );
}

export default function CreateLabelContent(): JSX.Element {
    const [projectLabels, setProjectLabels] = useState<any[]>([]);
    // const [sourceStorageLocation, setSourceStorageLocation] = useState(StorageLocation.LOCAL);
    // const [targetStorageLocation, setTargetStorageLocation] = useState(StorageLocation.LOCAL);
    const nameFormRef = useRef<FormInstance>(null);
    const nameInputRef = useRef<Input>(null);
    const advancedFormRef = useRef<FormInstance>(null);
    const dispatch = useDispatch();
    const history = useHistory();

    const resetForm = (): void => {
        if (nameFormRef.current) nameFormRef.current.resetFields();
        if (advancedFormRef.current) advancedFormRef.current.resetFields();
        setProjectLabels([]);
        // setSourceStorageLocation(StorageLocation.LOCAL);
        // setTargetStorageLocation(StorageLocation.LOCAL);
    };

    const focusForm = (): void => {
        nameInputRef.current?.focus();
    };

    const submit = async (): Promise<any> => {
        try {
            let projectData: Record<string, any> = {};
            if (nameFormRef.current) {
                const basicValues = await nameFormRef.current.validateFields();
                const advancedValues = advancedFormRef.current ? await advancedFormRef.current.validateFields() : {};

                projectData = {
                    ...projectData,
                    ...advancedValues,
                    name: basicValues.name,
                    source_storage: new Storage(
                        advancedValues.sourceStorage || { location: StorageLocation.LOCAL },
                    ).toJSON(),
                    target_storage: new Storage(
                        advancedValues.targetStorage || { location: StorageLocation.LOCAL },
                    ).toJSON(),
                };
            }

            projectData.labels = projectLabels;

            const createdProject = await dispatch(createProjectAsync(projectData));
            return createdProject;
        } catch {
            return false;
        }
    };

    const onSubmitAndOpen = async (): Promise<void> => {
        const createdProject = await submit();
        if (createdProject) {
            history.push('/tasks/create?projectId=' + createdProject.id);
        }
        console.log(createdProject);
    };

    const onSubmitAndContinue = async (): Promise<void> => {
        const res = await submit();
        if (res) {
            resetForm();
            notification.info({
                message: 'The project has been created',
                className: 'cvat-notification-create-project-success',
            });
            focusForm();
        }
    };

    useEffect(() => {
        focusForm();
    }, []);

    // <LabelsEditor
    return (
        <Row justify='center' align='middle' className='cvat-create-project-content'>
            <Col span={24}>
                <NameConfigurationForm formRef={nameFormRef} inputRef={nameInputRef} />
            </Col>
            <Col span={24}>
                <Text style={{ color: 'white', fontSize: '20px' }}>Create Labels</Text>
                <LabelsEditor
                    labels={projectLabels}
                    onSubmit={(newLabels): void => {
                        setProjectLabels(newLabels);
                    }}
                />
            </Col>
            <Col span={24}>
                <Row justify='end' gutter={5}>
                    <Col>
                        <Button
                            className='cvat-submit-open-project-button'
                            type='primary'
                            onClick={onSubmitAndOpen}
                            style={{
                                width: '200px',
                                height: '40px',
                                border: 'none',
                                backgroundColor: '#39B677',
                                fontSize: '18px',
                                borderRadius: '6px',
                            }}
                        >
                            Next
                        </Button>
                    </Col>
                    {/* <Col>
                        <Button
                            className='cvat-submit-continue-project-button'
                            type='primary'
                            onClick={onSubmitAndContinue}
                            style={{
                                width: '200px',
                                height: '40px',
                                border: 'none',
                                backgroundColor: 'green',
                                fontSize: '18px',
                                borderRadius: '6px',
                            }}
                        >
                            Create Another
                        </Button>
                    </Col> */}
                </Row>
            </Col>
        </Row>
    );
}
