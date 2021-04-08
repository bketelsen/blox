package cmd

import (
	"io/fs"
	"io/ioutil"
	"os"
	"path"
	"path/filepath"
	"strings"

	"github.com/cueblox/blox/internal/cuedb"
	"github.com/cueblox/blox/internal/encoding/markdown"
	"github.com/goccy/go-yaml"
	"github.com/hashicorp/go-multierror"
	"github.com/pterm/pterm"
	"github.com/spf13/cobra"
)

var (
	referentialIntegrity bool
)

var buildCmd = &cobra.Command{
	Use:   "build",
	Short: "Validate and build your data",
	Run: func(cmd *cobra.Command, args []string) {
		database, err := cuedb.NewDatabase()
		cobra.CheckErr(err)

		// Load Schemas!
		schemaDir, err := database.GetConfigString("schema_dir")
		cobra.CheckErr(err)
		pterm.Info.Println("Registering schemas")
		err = filepath.WalkDir(schemaDir, func(path string, d fs.DirEntry, err error) error {
			if !d.IsDir() {
				bb, err := os.ReadFile(path)
				if err != nil {
					return err
				}

				err = database.RegisterTables(string(bb))
				if err != nil {
					return err
				}
			}
			return nil
		})
		cobra.CheckErr(err)

		cobra.CheckErr(buildModels(&database))

		if referentialIntegrity {
			pterm.Info.Println("Checking Referential Integrity")
			err = database.ReferentialIntegrity()
			if err != nil {
				pterm.Error.Println(err)
			} else {
				pterm.Success.Println("Foreign Keys Validated")
			}
		}
		pterm.Info.Println("Creating output file")
		output := database.GetOutput()
		jso, err := output.MarshalJSON()
		cobra.CheckErr(err)

		buildDir, err := database.GetConfigString("build_dir")
		cobra.CheckErr(err)
		err = os.MkdirAll(buildDir, 0755)
		cobra.CheckErr(err)
		filename := "data.json"
		filePath := path.Join(buildDir, filename)
		err = os.WriteFile(filePath, jso, 0755)
		cobra.CheckErr(err)

	},
}

func buildModels(db *cuedb.Database) error {
	var errors error

	pterm.Debug.Println("Validating ...")

	for _, table := range db.GetTables() {
		pterm.Debug.Printf("\tCreating directory for table %s\n", table.Directory())
		err := os.MkdirAll(db.GetTableDataDir(table), 0755)
		if err != nil {
			errors = multierror.Append(err)
			continue
		}
		pterm.Debug.Printf("\tScanning %s\n", table.Directory())

		err = filepath.Walk(db.GetTableDataDir(table),
			func(path string, info os.FileInfo, err error) error {
				if err != nil {
					return err
				}

				if info.IsDir() {
					return err
				}
				pterm.Debug.Printf("\t\tFound %s\n", path)

				ext := strings.TrimPrefix(filepath.Ext(path), ".")

				if !table.IsSupportedExtension(ext) {
					return nil
				}

				slug := strings.TrimSuffix(filepath.Base(path), "."+ext)
				pterm.Debug.Printf("\t\tProcessing %s\n", slug)

				bytes, err := ioutil.ReadFile(path)
				if err != nil {
					return multierror.Append(err)
				}

				// Loaders to get to YAML
				// We should offer various, simple for now with markdown
				mdStr := ""
				if ext == "md" || ext == "mdx" {
					pterm.Debug.Printf("\t\tConverting %s from markdown\n", slug)

					mdStr, err = markdown.ToYAML(string(bytes))
					if err != nil {
						return err
					}

					bytes = []byte(mdStr)
				}

				var istruct = make(map[string]interface{})

				err = yaml.Unmarshal(bytes, &istruct)

				if err != nil {
					return multierror.Append(err)
				}

				record := make(map[string]interface{})
				record[slug] = istruct
				pterm.Debug.Printf("\t\tInserting %s into %s\n", slug, table.Directory())

				err = db.Insert(table, record)
				if err != nil {
					return multierror.Append(err)
				}
				pterm.Debug.Printf("\t\tInserted %s \n", slug)

				return err

			},
		)

		if err != nil {
			errors = multierror.Append(err)
		}
	}
	pterm.Debug.Println("Done validating")

	if errors != nil {
		pterm.Error.Println("Validations failed")
	} else {
		pterm.Success.Println("Validations complete")
	}

	return errors
}

func init() {
	rootCmd.AddCommand(buildCmd)

	buildCmd.Flags().BoolVarP(&referentialIntegrity, "referential-integrity", "i", false, "Enforce referential integrity")
}
