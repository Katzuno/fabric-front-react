import React, {useState, useEffect} from 'react';
import {Button, Table, Input} from 'reactstrap';
import axios from 'axios';
import {apiConfig} from "./config";
import CreateRecordForm from "./CreateRecordForm";

type Record = {
    id: number;
    title: string;
    release_year: number;
    imdb_id: string;
    images: string;
    metadata: any | null;
};

const RecordComponent: React.FC = () => {
    const [records, setRecords] = useState<Record[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null);
    const [editingRecordId, setEditingRecordId] = useState<number | null>(null);
    const [editingValues, setEditingValues] = useState<{ title?: string, release_year?: number, imdb_id?: string }>({});

    useEffect(() => {
        async function fetchRecords() {
            try {
                const response = await axios.get(`${apiConfig.baseUrl}/records`);
                setRecords(response.data);
            } catch (error) {
                console.error('Error fetching records:', error);
            }
        }

        fetchRecords();
    }, []);

    const searchRecords = async () => {
        try {
            const response = await axios.get(`${apiConfig.baseUrl}/records/search?query=${searchQuery}`);
            setRecords(response.data);
        } catch (error) {
            console.error('Error searching records:', error);
        }
    };

    const updateRecord = async (id: string, data: any) => {
        try {
            await axios.patch(`${apiConfig.baseUrl}/records/${id}`, data);
            const response = await axios.get(`${apiConfig.baseUrl}/records`);
            setRecords(response.data);
        } catch (error) {
            console.error('Error updating record:', error);
        }
    };

    const deleteRecord = async (id: number) => {
        try {
            await axios.delete(`${apiConfig.baseUrl}/records/${id}`);
            setRecords(prevRecords => prevRecords.filter(record => record.id !== id));
        } catch (error) {
            console.error('Error deleting record:', error);
        }
    };

    const startEditing = (record: Record) => {
        setEditingRecordId(record.id);
        setEditingValues({
            title: record.title,
            release_year: record.release_year,
            imdb_id: record.imdb_id
        });
    };

    const handleInputChange = (field: string, value: string | number) => {
        setEditingValues(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const saveChanges = async (recordId: number) => {
        try {
            await updateRecord(String(recordId), editingValues);
            setEditingRecordId(null);
            setEditingValues({});
        } catch (error) {
            console.error('Error saving changes:', error);
        }
    };

    return (
        <div>
            <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
            />
            <Button onClick={searchRecords}>Search</Button>

            <Table striped>
                <thead>
                <tr>
                    <th></th>
                    {/* Expand/Collapse column */}
                    <th>Title</th>
                    <th>Release Year</th>
                    <th>IMDB ID</th>
                    <th>Images</th>
                    <th>Metadata</th>
                    <th></th>
                    {/* Edit/Save column */}
                    <th></th>
                    {/* Delete column */}
                </tr>
                </thead>
                <tbody>
                {records.map(record => {
                    if (typeof record.metadata === 'string' && record?.metadata) {
                        record.metadata = JSON.parse(record.metadata);
                    }

                    return <React.Fragment key={record.imdb_id}>
                        <tr>
                            <td>
                                {record.metadata &&
                                    <Button onClick={() => {
                                        if (expandedRecordId === record.imdb_id) {
                                            setExpandedRecordId(null);
                                        } else {
                                            setExpandedRecordId(record.imdb_id);
                                        }
                                    }}>
                                        Toggle metadata
                                    </Button>
                                }
                            </td>
                            <td>
                                {editingRecordId === record.id ? (
                                    <Input value={editingValues.title || ''}
                                           onChange={e => handleInputChange('title', e.target.value)}/>
                                ) : record.title}
                            </td>
                            <td>
                                {editingRecordId === record.id ? (
                                    <Input type="number" value={editingValues.release_year || 0}
                                           onChange={e => handleInputChange('release_year', Number(e.target.value))}/>
                                ) : record.release_year}
                            </td>
                            <td>
                                {editingRecordId === record.id ? (
                                    <Input value={editingValues.imdb_id || ''}
                                           onChange={e => handleInputChange('imdb_id', e.target.value)}/>
                                ) : record.imdb_id}
                            </td>
                            <td><img src={record.images} alt={record.title} height="100"/></td>
                            <td>Metadata {record?.metadata ? 'Available' : 'NOT Available'}</td>
                            <td>
                                {editingRecordId === record.id ? (
                                    <Button onClick={() => saveChanges(record.id)}>Save</Button>
                                ) : (
                                    <Button onClick={() => startEditing(record)}>Edit</Button>
                                )}
                            </td>
                            <td>
                                <Button color="danger" onClick={() => deleteRecord(record.id)}>Delete</Button>
                            </td>
                        </tr>
                        {expandedRecordId === record.imdb_id && record?.metadata && (
                            <tr>
                                <td colSpan={8}>
                                    <Table bordered>
                                        <tbody>
                                        {record.metadata && (Object.entries(record.metadata) as [string, any][]).map(([key, value]) => (
                                            <tr key={key}>
                                                <td><strong>{key}:</strong></td>
                                                <td>{typeof value === 'object' ? JSON.stringify(value) : value}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                })}
                </tbody>
            </Table>

            <CreateRecordForm/>
        </div>
    );
};

export default RecordComponent;
