// Copyright (C) 2020-2022 Intel Corporation
//
// SPDX-License-Identifier: MIT

import './styles.scss';
import React from 'react';
import { Row, Col } from 'antd/lib/grid';
import Text from 'antd/lib/typography/Text';
import SelectProjectType from './select-project-type';
// import ObjectDetection from '../../assets/object-detection.svg';
// import ObjectDetection1 from '../../assets/object-detection-1.svg';
// import InstanceSegmentation from '../../assets/instance-segmentation.svg';
// import InstanceSegmentation1 from '../../assets/instance-segmentation-1.svg';

function CreateProjectPageComponent(): JSX.Element {
    return (
        <div>
            <Row align='top' className='cvat-create-work-form-wrapper'>
                <Col>
                    <Text style={{ color: 'white' }}>
                        Create a new project
                    </Text>
                    <br />
                    <Text style={{ color: 'white', fontSize: '1.6rem' }}>
                        Select Project Type
                    </Text>
                </Col>
            </Row>
            <Row justify='center'>
                <SelectProjectType />
            </Row>
        </div>
    );
}

export default React.memo(CreateProjectPageComponent);
