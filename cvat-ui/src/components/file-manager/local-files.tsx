// Copyright (C) 2022 Intel Corporation
// Copyright (C) 2022 CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';

import Text from 'antd/lib/typography/Text';
import Upload, { RcFile } from 'antd/lib/upload';
import { InboxOutlined } from '@ant-design/icons';

interface Props {
    files: File[];
    many: boolean;
    onUpload: (_: RcFile, uploadedFiles: RcFile[]) => boolean;
}

export default function LocalFiles(props: Props): JSX.Element {
    const { files, onUpload, many } = props;
    const hintText = many ? 'You can upload one or more videos' :
        'You can upload an archive with images, a video, or multiple images';

    return (
        <>
            <Upload.Dragger
                multiple
                listType='text'
                fileList={files as any[]}
                showUploadList={
                    files.length < 5 && {
                        showRemoveIcon: false,
                    }
                }
                beforeUpload={onUpload}
                style={{ backgroundColor: '#0C1543', borderRadius: '6px', color: 'white' }}
            >
                <p className='ant-upload-drag-icon'>
                    <InboxOutlined />
                </p>
                <p className='ant-upload-text' style={{ color: 'white' }}>Click or drag files to this area</p>
                <p className='ant-upload-hint' style={{ color: 'white' }}>{ hintText }</p>
            </Upload.Dragger>
            {files.length >= 5 && (
                <>
                    <br />
                    <Text style={{ color: 'white' }}>{`${files.length} files selected`}</Text>
                </>
            )}
        </>
    );
}
