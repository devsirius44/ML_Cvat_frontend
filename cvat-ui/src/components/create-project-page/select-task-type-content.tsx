import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Col, Row } from 'antd';
import Text from 'antd/lib/typography/Text';
import DataLabeling from '../../assets/data-labeling.png';
import DverseSelection from '../../assets/dverse-selection.png';
import Training from '../../assets/training.png';
import Evaluation from '../../assets/evaluation.png';
import Augmentation from '../../assets/augmentation.png';
import AutoLabeling from '../../assets/auto-labeling.png';
import { Task, Job } from 'cvat-core-wrapper';

interface Props {
    task: Task;
}

const methodData = [
    {
        method: DataLabeling,
        description: 'Data Labeling',
    },
    {
        method: DverseSelection,
        description: 'Diverse Selection',
    },
    {
        method: Augmentation,
        description: 'Augmentation',
    },
    {
        method: AutoLabeling,
        description: 'Auto Labeling',
    },
    {
        method: Training,
        description: 'Training',
    },
    {
        method: Evaluation,
        description: 'Evaluation',
    },
];
export default function SelectTaskTypeContent({ task }: Props): JSX.Element {
    const [jobs, setJobs] = useState<Job[]>([]);

    useEffect(() => {
        if(task && task.jobs && task.jobs.length) {
            setJobs(task.jobs);
        }
    }, [task])

    return (
        <div style={{ width: '80%', justifyContent: 'center', display: 'flex' }}>
            <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
                {methodData.map(
                    (data): JSX.Element => (
                        <Col md={24} lg={12} xl={8} xxl={8} style={{ marginBottom: '20px' }}>
                            <Link to={jobs[0] ? `/tasks/${task.id}/jobs/${jobs[0].id}` : ''} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <img src={data.method} alt='target' style={{ width: '100%' }} />
                                <Text style={{
                                    color: 'white', fontSize: '1.5rem', textAlign: 'center',
                                }}
                                >
                                    {data.description}
                                </Text>
                            </Link>
                        </Col>
                    ),
                )}
            </Row>
        </div>
    );
}
