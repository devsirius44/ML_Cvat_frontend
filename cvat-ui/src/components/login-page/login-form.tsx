// Copyright (C) 2020-2022 Intel Corporation
// Copyright (C) 2022-2023 CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Form from 'antd/lib/form';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import { Col, Row } from 'antd/lib/grid';
import Text from 'antd/lib/typography/Text';
import Icon from '@ant-design/icons';
import { BackArrowIcon } from 'icons';
import { CombinedState } from 'reducers';
import CVATSigningInput, { CVATInputType } from 'components/signing-common/cvat-signing-input';
import { usePlugins } from 'utils/hooks';

export interface LoginData {
    credential: string;
    password: string;
}

interface Props {
    renderResetPassword: boolean;
    fetching: boolean;
    onSubmit(loginData: LoginData): void;
}

function LoginFormComponent(props: Props): JSX.Element {
    const { fetching, onSubmit, renderResetPassword } = props;
    const [form] = Form.useForm();
    const [credential, setCredential] = useState('');
    const pluginsToRender = usePlugins((state: CombinedState) => state.plugins.components.loginPage.loginForm, props, {
        credential,
    });

    const forgotPasswordLink = (
        <Col className='cvat-credentials-link'>
            <Text strong className='user_info'>
                <Link
                    to={credential.includes('@') ? `/auth/password/reset?credential=${credential}` : '/auth/password/reset'}
                >
                    Forgot password?
                </Link>
            </Text>
        </Col>
    );

    return (
        <div className='cvat-login-form-wrapper'>
            <Row justify='space-between' className='cvat-credentials-navigation'>
                {credential && (
                    <Col>
                        <Icon
                            component={BackArrowIcon}
                            onClick={() => {
                                setCredential('');
                                form.setFieldsValue({ credential: '' });
                            }}
                        />
                    </Col>
                )}
                {!credential && (
                    <Row>
                        <Col className='cvat-credentials-link'>
                            <Text strong className='user_info'>
                                New user?&nbsp;
                                <Link to='/auth/register'>Create an account</Link>
                            </Text>
                        </Col>
                    </Row>
                )}
                {renderResetPassword && forgotPasswordLink}
            </Row>
            <Col>
                <Text style={{ color: 'white', fontSize: '3rem', fontWeight: 'bold' }}> Sign in </Text>
            </Col>
            <Form
                className={`cvat-login-form ${credential ? 'cvat-login-form-extended' : ''}`}
                form={form}
                onFinish={(loginData: LoginData) => {
                    onSubmit(loginData);
                }}
            >
                <Form.Item className='cvat-credentials-form-item' name='credential'>
                    <Input
                        placeholder='Email or username'
                        className={credential ? 'cvat-input-floating-label-above' : 'cvat-input-floating-label'}
                        onChange={(event) => {
                            const { value } = event.target;
                            setCredential(value);
                            if (!value) form.setFieldsValue({ credential: '', password: '' });
                        }}
                    />
                </Form.Item>
                {credential && (
                    <Form.Item
                        className='cvat-credentials-form-item'
                        name='password'
                        rules={[
                            {
                                required: true,
                                message: 'Please specify a password',
                            },
                        ]}
                    >
                        <CVATSigningInput
                            type={CVATInputType.PASSWORD}
                            id='password'
                            placeholder='Password'
                        />
                    </Form.Item>
                )}
                {credential && (
                    <Form.Item>
                        <Button
                            className='cvat-credentials-action-button'
                            loading={fetching}
                            disabled={!credential}
                            htmlType='submit'
                        >
                            Next
                        </Button>
                    </Form.Item>
                )}
                {pluginsToRender.map((Component: React.FunctionComponent, index: number) => (
                    <Component key={index} />
                ))}
            </Form>
        </div>
    );
}

export default React.memo(LoginFormComponent);
