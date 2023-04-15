// Copyright (C) 2020-2022 Intel Corporation
//
// SPDX-License-Identifier: MIT

import './styles.scss';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { Row, Col } from 'antd/lib/grid';
import Text from 'antd/lib/typography/Text';
import notification from 'antd/lib/notification';
import SelectTaskTypeContent from './select-task-type-content';
// import ObjectDetection from '../../assets/object-detection.svg';
// import ObjectDetection1 from '../../assets/object-detection-1.svg';
// import InstanceSegmentation from '../../assets/instance-segmentation.svg';
// import InstanceSegmentation1 from '../../assets/instance-segmentation-1.svg';
import { getCore, Task, Job } from 'cvat-core-wrapper';

const core = getCore();

export default function SelectTaskType(): JSX.Element {
    const id = +useParams<{ id: string }>().id;
    const [taskInstance, setTaskInstance] = useState<Task | null>(null);
    const [fetchingTask, setFetchingTask] = useState(true);
    const mounted = useRef(false);

    const receieveTask = (): void => {
        if (Number.isInteger(id)) {
            console.log(id)
            core.tasks.get({ id })
                .then(([task]: Task[]) => {
                    if (task && mounted.current) {
                        console.log(task)
                        setTaskInstance(task);
                    }
                }).catch((error: Error) => {
                    if (mounted.current) {
                        notification.error({
                            message: 'Could not receive the requested project from the server',
                            description: error.toString(),
                        });
                    }
                }).finally(() => {
                    if (mounted.current) {
                        setFetchingTask(false);
                    }
                });
        } else {
            notification.error({
                message: 'Could not receive the requested task from the server',
                description: `Requested task id "${id}" is not valid`,
            });
            setFetchingTask(false);
        }
    };

    useEffect(() => {
        receieveTask();
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    return (
        <div style={{ justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
            <Row align='top' className='cvat-create-work-form-wrapper'>
                <Col>
                    <Text className='cvat-title' style={{ color: 'white' }}>
                        Create a new task
                    </Text>
                    <br />
                    <Text style={{ color: 'white', fontSize: '1.6rem' }}>
                        Select Task Type
                    </Text>
                </Col>
            </Row>
            <br />
            <Row align='middle' justify='center'>
                <SelectTaskTypeContent task={taskInstance} />
            </Row>
        </div>
    );
}
