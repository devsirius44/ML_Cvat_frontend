// Copyright (C) 2020-2022 Intel Corporation
// Copyright (C) 2022 CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import Text from 'antd/lib/typography/Text';
import { Row, Col } from 'antd/lib/grid';
import notification from 'antd/lib/notification';
import Button from 'antd/lib/button';
import { MoreOutlined } from '@ant-design/icons';
import Dropdown from 'antd/lib/dropdown';
import Progress from 'antd/lib/progress';
import moment from 'moment';

import ActionsMenuContainer from 'containers/actions-menu/actions-menu';
import Preview from 'components/common/preview';
import { ActiveInference } from 'reducers';
import AutomaticAnnotationProgress from './automatic-annotation-progress';
import { getCore, Task, Job } from 'cvat-core-wrapper';

const core = getCore();

interface TaskItemState {
    jobs: Job[];
}
export interface TaskItemProps {
    taskInstance: any;
    deleted: boolean;
    hidden: boolean;
    activeInference: ActiveInference | null;
    cancelAutoAnnotation(): void;
}

class TaskItemComponent extends React.PureComponent<TaskItemProps & RouteComponentProps, TaskItemState> {
    public constructor(props: TaskItemProps & RouteComponentProps) {
        super(props);

        this.state = {
            jobs: []
        };
    }

    public componentDidMount(): void {
        const { id } = this.props.taskInstance;

        core.tasks.get({ id }).then(([task]: Task[]) => {
            if (task && task.jobs) {
                this.setState({jobs: task.jobs});
            }
        }).catch((error: Error) => {
            notification.error({
                message: 'Could not receive the requested project from the server',
                description: error.toString(),
            });
        });
    }

    private renderPreview(): JSX.Element {
        const { taskInstance } = this.props;
        return (
            <Col span={4}>
                <Preview
                    task={taskInstance}
                    loadingClassName='cvat-task-item-loading-preview'
                    emptyPreviewClassName='cvat-task-item-empty-preview'
                    previewWrapperClassName='cvat-task-item-preview-wrapper'
                    previewClassName='cvat-task-item-preview'
                />
            </Col>
        );
    }

    private renderDescription(): JSX.Element {
        // Task info
        const { taskInstance } = this.props;
        const { id } = taskInstance;
        const owner = taskInstance.owner ? taskInstance.owner.username : null;
        const updated = moment(taskInstance.updatedDate).fromNow();
        const created = moment(taskInstance.createdDate).format('MMMM Do YYYY');

        // Get and truncate a task name
        const name = `${taskInstance.name.substring(0, 70)}${taskInstance.name.length > 70 ? '...' : ''}`;

        return (
            <Col span={10} className='cvat-task-item-description'>
                <Text strong type='secondary' className='cvat-item-task-id'>{`#${id}: `}</Text>
                <Text strong className='cvat-item-task-name'>
                    {name}
                </Text>
                <br />
                {owner && (
                    <>
                        <Text type='secondary'>{`Created ${owner ? `by ${owner}` : ''} on ${created}`}</Text>
                        <br />
                    </>
                )}
                <Text type='secondary'>{`Last updated ${updated}`}</Text>
            </Col>
        );
    }

    private renderProgress(): JSX.Element {
        const { taskInstance, activeInference, cancelAutoAnnotation } = this.props;
        // Count number of jobs and performed jobs
        const numOfJobs = taskInstance.progress.totalJobs;
        const numOfCompleted = taskInstance.progress.completedJobs;

        // Progress appearance depends on number of jobs
        let progressColor = null;
        let progressText = null;
        if (numOfCompleted && numOfCompleted === numOfJobs) {
            progressColor = 'cvat-task-completed-progress';
            progressText = (
                <Text strong className={progressColor}>
                    Completed
                </Text>
            );
        } else if (numOfCompleted) {
            progressColor = 'cvat-task-progress-progress';
            progressText = (
                <Text strong className={progressColor}>
                    In Progress
                </Text>
            );
        } else {
            progressColor = 'cvat-task-pending-progress';
            progressText = (
                <Text strong className={progressColor}>
                    Pending
                </Text>
            );
        }

        const jobsProgress = numOfCompleted / numOfJobs;

        return (
            <Col span={6}>
                <Row justify='space-between' align='top'>
                    <Col>
                        <svg height='8' width='8' className={progressColor}>
                            <circle cx='4' cy='4' r='4' strokeWidth='0' />
                        </svg>
                        {progressText}
                    </Col>
                    <Col>
                        <Text type='secondary'>{`${numOfCompleted} of ${numOfJobs} jobs`}</Text>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Progress
                            className={`${progressColor} cvat-task-progress`}
                            percent={jobsProgress * 100}
                            strokeColor='#1890FF'
                            showInfo={false}
                            strokeWidth={5}
                            size='small'
                        />
                    </Col>
                </Row>
                <AutomaticAnnotationProgress
                    activeInference={activeInference}
                    cancelAutoAnnotation={cancelAutoAnnotation}
                />
            </Col>
        );
    }

    private renderNavigation(): JSX.Element {
        const { taskInstance, history } = this.props;
        const { id } = taskInstance;
        const { jobs } = this.state;

        return (
            <Col span={4}>
                <Row justify='end'>
                    <Col>
                        <Button
                            className='cvat-item-open-task-button'
                            style={{
                                width: '100px',
                                height: '45px',
                                border: 'none',
                                backgroundColor: '#39B677',
                                fontSize: '18px',
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '6px',
                                color: 'white'
                            }}
                            type='link'
                            size='large'
                            ghost
                            href={jobs[0] ? `/tasks/${id}/jobs/${jobs[0].id}` : ''}
                            onClick={(e: React.MouseEvent): void => {
                                e.preventDefault();
                                history.push(jobs[0] ? `/tasks/${id}/jobs/${jobs[0].id}` : '');
                            }}
                        >
                            Open
                        </Button>
                    </Col>
                </Row>
                <Row justify='end'>
                    <Dropdown overlay={<ActionsMenuContainer taskInstance={taskInstance} />}>
                        <Col className='cvat-item-open-task-actions'>
                            <Text style={{ color: 'white' }}>Actions</Text>
                            <MoreOutlined className='cvat-menu-icon' style={{ color: 'white' }} />
                        </Col>
                    </Dropdown>
                </Row>
            </Col>
        );
    }

    public render(): JSX.Element {
        const { deleted, hidden } = this.props;
        const style = {};
        if (deleted) {
            (style as any).pointerEvents = 'none';
            (style as any).opacity = 0.5;
        }

        if (hidden) {
            (style as any).display = 'none';
        }

        return (
            <Row className='cvat-tasks-list-item' justify='space-between' align='top' style={{ backgroundColor: '#212D52', border: 'none' }}>
                {this.renderPreview()}
                {/* {this.renderDescription()}
                {this.renderProgress()} */}
                {this.renderNavigation()}
            </Row>
        );
    }
}

export default withRouter(TaskItemComponent);
