// Copyright (C) 2022 CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT
import React, { useEffect, useState } from 'react';
import { Input } from 'antd';
// import Icon from '@ant-design/icons';
// import { ClearIcon } from 'icons';
// import Text from 'antd/lib/typography/Text';

interface SocialAccountLinkProps {
    id?: string;
    autoComplete?: string;
    placeholder: string;
    value?: string;
    type?: CVATInputType;
    onReset?: () => void;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export enum CVATInputType {
    TEXT = 'text',
    PASSWORD = 'password',
}

function CVATSigningInput(props: SocialAccountLinkProps): JSX.Element {
    const { id, autoComplete, type, placeholder, value, onChange } = props;
    // const [setValueNonEmpty] = useState(false);
    // useEffect((): void => {
    //     setValueNonEmpty(!!value);
    // }, [value]);

    if (type === CVATInputType.PASSWORD) {
        return (
            <Input.Password
                value={value}
                autoComplete={autoComplete}
                style={{ borderRadius: '6px', padding: '10px', }}
                id={id}
                onChange={onChange}
            />
        );
    }
    return (
        <Input
            value={value}
            autoComplete={autoComplete}
            style={{ backgroundColor: '#0C1543', color: 'white' }}
            placeholder={placeholder}
            id={id}
            onChange={onChange}
        />
    );
}

export default React.memo(CVATSigningInput);
