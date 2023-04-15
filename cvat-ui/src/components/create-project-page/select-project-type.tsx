import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'antd/lib';
import Text from 'antd/lib/typography/Text';
import ObjectDetection1 from '../../assets/object-detection-1.png';
import ObjectDetection from '../../assets/object-detection.png';
import InstanceSegment from '../../assets/instance-segmentation.png';
import InstanceSegment1 from '../../assets/instance-segmentation-1.png';
// import { RocketTwoTone } from '@ant-design/icons';

const typeData = [
    {
        link: '/projects/create/create-label',
        img: ObjectDetection,
        description: 'Object Detection',
    },
    {
        link: '/projects/create',
        img: ObjectDetection1,
        description: 'Object Detection',
    },
    {
        link: '/projects/create/',
        img: InstanceSegment,
        description: 'Instance Segmentation',
    },
    {
        link: '/projects/create',
        img: InstanceSegment1,
        description: 'Instance Segmentation',
    },
];
export default function SelectProjectType(): JSX.Element {
    return (
        <Row
            style={{
                display: 'flex',
                justifyContent: 'center',
                maxWidth: '80%',
                marginTop: '2rem',
            }}
        >
            {typeData.map(
                (data): JSX.Element => (
                    <Col md={24} lg={24} xl={12} xxl={12}>
                        <Link to={data.link} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <img src={data.img} alt='target' />
                            <Text
                                style={{
                                    color: 'white',
                                    fontSize: '1.5rem',
                                    textAlign: 'center',
                                }}
                            >
                                {data.description}
                            </Text>
                        </Link>
                    </Col>
                ),
            )}
        </Row>
    );
}
