import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

const Index = () => {
  const [csvData, setCsvData] = useState([]);
  const [editingRow, setEditingRow] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const rows = content.split('\n').map(row => row.split(','));
        setCsvData(rows);
        toast.success("CSV file uploaded successfully");
      };
      reader.readAsText(file);
    }
  };

  const handleAddRow = () => {
    const newRow = Array(csvData[0]?.length).fill('');
    setCsvData([...csvData, newRow]);
  };

  const handleEditRow = (index) => {
    setEditingRow(index);
  };

  const handleSaveRow = (index) => {
    setEditingRow(null);
  };

  const handleDeleteRow = (index) => {
    const newData = csvData.filter((_, i) => i !== index);
    setCsvData(newData);
    toast.success("Row deleted successfully");
  };

  const handleCellChange = (rowIndex, cellIndex, value) => {
    const newData = [...csvData];
    newData[rowIndex][cellIndex] = value;
    setCsvData(newData);
  };

  const handleDownload = () => {
    const content = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "edited_data.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    toast.success("CSV file downloaded successfully");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CSV Management Tool</h1>
      <div className="mb-4">
        <Input type="file" accept=".csv" onChange={handleFileUpload} className="mb-2" />
        <Button onClick={handleAddRow} className="mr-2">Add Row</Button>
        <Button onClick={handleDownload}>Download CSV</Button>
      </div>
      {csvData.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              {csvData[0].map((header, index) => (
                <TableHead key={index}>{header}</TableHead>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {csvData.slice(1).map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex}>
                    {editingRow === rowIndex ? (
                      <Input
                        value={cell}
                        onChange={(e) => handleCellChange(rowIndex + 1, cellIndex, e.target.value)}
                      />
                    ) : (
                      cell
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  {editingRow === rowIndex ? (
                    <Button onClick={() => handleSaveRow(rowIndex)} className="mr-2">Save</Button>
                  ) : (
                    <Button onClick={() => handleEditRow(rowIndex)} className="mr-2">Edit</Button>
                  )}
                  <Button onClick={() => handleDeleteRow(rowIndex + 1)} variant="destructive">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Index;