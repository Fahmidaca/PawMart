import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAuth } from '../contexts/AuthContext';
import { Download, FileText } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const PDFReportGenerator = ({ pet, healthRecords, vaccinations, analytics, reportType = 'health' }) => {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateHealthReport = async () => {
    if (!user) {
      toast.error('Please login to generate report');
      return;
    }

    if (!pet) {
      toast.error('No pet selected');
      return;
    }

    setIsGenerating(true);
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(24);
      doc.setTextColor(241, 118, 26); // WarmPaws orange
      doc.text('WarmPaws', 20, 20);
      
      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.text('Pet Health Report', 20, 32);
      
      // Pet Info Section
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${format(new Date(), 'MMMM dd, yyyy')}`, 20, 45);
      
      // Pet Details Box
      doc.setFillColor(245, 245, 245);
      doc.roundedRect(20, 55, 170, 40, 3, 3, 'F');
      
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text(`Pet Name: ${pet.name}`, 25, 68);
      
      doc.setFontSize(11);
      doc.setTextColor(80, 80, 80);
      doc.text(`Species: ${pet.species || 'N/A'}`, 25, 78);
      doc.text(`Breed: ${pet.breed || 'Mixed'}`, 90, 78);
      doc.text(`Age: ${pet.age ? `${pet.age} years` : 'N/A'}`, 25, 88);
      doc.text(`Weight: ${pet.weight ? `${pet.weight} ${pet.weightUnit || 'kg'}` : 'N/A'}`, 90, 88);
      
      // Health Score
      if (analytics?.healthScore !== undefined) {
        const scoreColor = analytics.healthScore >= 80 ? [34, 197, 94] : 
                          analytics.healthScore >= 60 ? [234, 179, 8] : [239, 68, 68];
        doc.setFillColor(...scoreColor);
        doc.roundedRect(150, 60, 35, 30, 3, 3, 'F');
        doc.setFontSize(20);
        doc.setTextColor(255, 255, 255);
        doc.text(`${analytics.healthScore}`, 160, 78);
        doc.setFontSize(8);
        doc.text('Health Score', 153, 86);
      }
      
      // Summary Statistics
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text('Health Summary', 20, 110);
      
      const summaryData = [
        ['Total Health Records', analytics?.totalRecords?.toString() || '0'],
        ['Vaccinations', analytics?.vaccinations?.toString() || '0'],
        ['Checkups', analytics?.checkups?.toString() || '0'],
        ['Illnesses Recorded', analytics?.illnesses?.toString() || '0'],
        ['Medications', analytics?.medications?.toString() || '0']
      ];
      
      autoTable(doc, {
        body: summaryData,
        startY: 115,
        theme: 'plain',
        styles: {
          fontSize: 10,
          cellPadding: 4,
        },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 80 },
          1: { cellWidth: 40 }
        },
        margin: { left: 20 }
      });
      
      // Vaccination Records
      if (vaccinations && vaccinations.length > 0) {
        const vaccinationY = doc.lastAutoTable.finalY + 15;
        doc.setFontSize(14);
        doc.setTextColor(40, 40, 40);
        doc.text('Vaccination Records', 20, vaccinationY);
        
        const vaccinationData = vaccinations.map((vax, index) => [
          (index + 1).toString(),
          vax.vaccineName,
          format(new Date(vax.scheduledDate), 'MMM dd, yyyy'),
          vax.status === 'completed' ? 'Completed' : 
            vax.status === 'overdue' ? 'Overdue' : 'Scheduled',
          vax.veterinarian || 'N/A'
        ]);
        
        autoTable(doc, {
          head: [['#', 'Vaccine', 'Date', 'Status', 'Veterinarian']],
          body: vaccinationData,
          startY: vaccinationY + 5,
          styles: {
            fontSize: 9,
            cellPadding: 3,
          },
          headStyles: {
            fillColor: [59, 130, 246],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245],
          },
          margin: { left: 20, right: 20 }
        });
      }
      
      // Health Records
      if (healthRecords && healthRecords.length > 0) {
        const recordsY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 180;
        
        // Check if we need a new page
        if (recordsY > 250) {
          doc.addPage();
          doc.setFontSize(14);
          doc.setTextColor(40, 40, 40);
          doc.text('Health Records (continued)', 20, 20);
        } else {
          doc.setFontSize(14);
          doc.setTextColor(40, 40, 40);
          doc.text('Health Records', 20, recordsY);
        }
        
        const recordData = healthRecords.slice(0, 10).map((record, index) => [
          (index + 1).toString(),
          record.title,
          record.type.charAt(0).toUpperCase() + record.type.slice(1),
          format(new Date(record.date), 'MMM dd, yyyy'),
          record.veterinarian || 'N/A'
        ]);
        
        autoTable(doc, {
          head: [['#', 'Title', 'Type', 'Date', 'Veterinarian']],
          body: recordData,
          startY: recordsY > 250 ? 25 : recordsY + 5,
          styles: {
            fontSize: 9,
            cellPadding: 3,
          },
          headStyles: {
            fillColor: [16, 185, 129],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245],
          },
          margin: { left: 20, right: 20 }
        });
      }
      
      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `WarmPaws Pet Health Report - Page ${i} of ${pageCount}`,
          105,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }
      
      // Save the PDF
      const fileName = `${pet.name.replace(/\s+/g, '_')}_health_report_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      doc.save(fileName);
      
      toast.success('Health report generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate health report');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-600 dark:text-gray-400">
          Please login to generate health reports
        </p>
      </div>
    );
  }

  return (
    <button
      onClick={generateHealthReport}
      disabled={isGenerating || !pet}
      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isGenerating ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          Generating...
        </>
      ) : (
        <>
          <Download className="h-5 w-5" />
          Download Health Report (PDF)
        </>
      )}
    </button>
  );
};

export default PDFReportGenerator;
